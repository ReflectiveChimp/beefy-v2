import { createAsyncThunk } from '@reduxjs/toolkit';
import type { BeefyState } from '../../../redux-types';
import { getAnalyticsApi, getClmApi } from '../apis/instances';
import {
  type AnyTimelineAnalyticsEntity,
  type AnyTimelineAnalyticsEntry,
  type CLMTimelineAnalyticsEntry,
  type CLMTimelineAnalyticsEntryWithoutVaultId,
  isCLMTimelineAnalyticsEntity,
  type TimelineAnalyticsEntryToEntity,
  type VaultTimelineAnalyticsEntry,
  type VaultTimelineAnalyticsEntryWithoutVaultId,
} from '../entities/analytics';
import BigNumber from 'bignumber.js';
import type {
  AnalyticsPriceResponse,
  CLMTimelineAnalyticsConfig,
  TimeBucketType,
  TimelineAnalyticsConfig,
} from '../apis/analytics/analytics-types';
import { isCowcentratedVault, isStandardVault, type VaultEntity } from '../entities/vault';
import { isFiniteNumber } from '../../../helpers/number';
import {
  selectAllVaultsWithBridgedVersion,
  selectCowcentratedVaultById,
  selectVaultById,
  selectVaultStrategyAddressOrUndefined,
} from '../selectors/vaults';
import { selectCowcentratedVaultDepositTokens } from '../selectors/tokens';
import { groupBy, keyBy, mapValues, omitBy, partition, sortBy } from 'lodash-es';
import type { ChainEntity } from '../entities/chain';
import { entries } from '../../../helpers/object';
import { BIG_ZERO } from '../../../helpers/big-number';
import { selectUserDepositedVaultIds } from '../selectors/balance';
import {
  selectClmHarvestsByVaultId,
  selectUserDepositedTimelineByVaultId,
  selectUserFirstDepositDateByVaultId,
  selectUserHasCurrentDepositTimelineByVaultId,
} from '../selectors/analytics';
import type {
  ApiClmHarvestPriceRow,
  ClmPendingRewardsResponse,
} from '../apis/clm-api/clm-api-types';
import type { TokenEntity } from '../entities/token';
import { isAfter } from 'date-fns';
import {
  selectDashboardShouldLoadBalanceForChainUser,
  selectIsClmHarvestsForUserChainPending,
  selectIsClmHarvestsForUserPending,
  selectIsWalletTimelineForUserPending,
} from '../selectors/data-loader';
import { selectAllChainIds } from '../selectors/chains';
import { fetchAllBalanceAction } from './balance';
import { PromiseSettledAwaiter } from '../../../helpers/promises';
import { isDefined } from '../utils/array-utils';
import { getDataApiBucketsFromDates } from '../apis/beefy/beefy-data-api-helpers';
import type { ApiTimeBucket } from '../apis/beefy/beefy-data-api-types';

export interface FetchWalletTimelineFulfilled {
  timelines: Record<VaultEntity['id'], AnyTimelineAnalyticsEntity>;
  walletAddress: string;
}

type BaseVault = {
  productKey: string;
  vaultId: string;
  chainId: string;
};

function makeTransactionId(config: TimelineAnalyticsConfig | CLMTimelineAnalyticsConfig): string {
  if (config.transaction_hash) {
    return `${config.chain}:${config.transaction_hash}`;
  }

  // old data doesn't have transaction_hash so we try to make an id that is the same for a given vault/boost tx
  const shareDiff = new BigNumber(config.share_diff);
  return `${config.chain}-${config.datetime}-${shareDiff.absoluteValue().toString(10)}`;
}

/**
 * Partitions a timeline into current and past entries based on the last zero share balance entry
 * @param timeline must be in order from oldest to newest
 */
function partitionTimeline<T extends AnyTimelineAnalyticsEntry>(
  timeline: T[]
): TimelineAnalyticsEntryToEntity<T> {
  const currentStartingIndex = timeline.findLastIndex((tx: T) => tx.shareBalance.isZero()) + 1;
  const current = timeline.slice(currentStartingIndex);
  const past = timeline.slice(0, currentStartingIndex);

  let buckets: ApiTimeBucket[] = [];
  if (current.length > 1) {
    const oldest = current[0].datetime;
    const newest = current[current.length - 1].datetime;
    buckets = getDataApiBucketsFromDates(oldest, newest);
  }

  return { type: timeline[0].type, current, past, buckets };
}

function omitEmptyTimelines<T extends AnyTimelineAnalyticsEntry>(
  timelines: Record<VaultEntity['id'], T[]>
): Record<VaultEntity['id'], T[]> {
  return omitBy(timelines, txs => !txs || txs.length === 0);
}

function mergeAndPartitionTimelines(
  standardByVault: Record<VaultEntity['id'], VaultTimelineAnalyticsEntry[]>,
  clmByVault: Record<VaultEntity['id'], CLMTimelineAnalyticsEntry[]>
): Record<VaultEntity['id'], AnyTimelineAnalyticsEntity> {
  const standardPartitioned = mapValues(omitEmptyTimelines(standardByVault), partitionTimeline);
  const clmPartitioned = mapValues(omitEmptyTimelines(clmByVault), partitionTimeline);
  return { ...standardPartitioned, ...clmPartitioned };
}

function handleDatabarnTimeline(
  timeline: VaultTimelineAnalyticsEntryWithoutVaultId[],
  state: BeefyState
): Record<VaultEntity['id'], VaultTimelineAnalyticsEntry[]> {
  // Separate out all boost txs
  const [boostTxs, vaultTxs] = partition(timeline, tx => tx.productKey.startsWith('beefy:boost'));

  // Grab all the tx hashes from the boost txs, and filter out any vault txs that have the same hash
  const boostTxIds = new Set(boostTxs.map(tx => tx.transactionId));
  const vaultIdsWithMerges = new Set<string>();
  const vaultTxsIgnoringBoosts = vaultTxs
    .map(tx => ({ ...tx, vaultId: tx.displayName }))
    .filter(tx => {
      if (boostTxIds.has(tx.transactionId)) {
        vaultIdsWithMerges.add(tx.vaultId);
        return false;
      }
      return true;
    });

  // Build a map of bridge vaults to their base vaults
  const bridgeVaultIds = selectAllVaultsWithBridgedVersion(state);
  const bridgeToBaseId = bridgeVaultIds.reduce(
    (accum: Partial<Record<ChainEntity['id'], BaseVault>>, vault) => {
      if (isStandardVault(vault) && vault.bridged) {
        for (const [chainId, address] of entries(vault.bridged)) {
          accum[`beefy:vault:${chainId}:${address.toLowerCase()}`] = {
            vaultId: vault.id,
            chainId: vault.chainId,
            productKey: `beefy:vault:${vault.chainId}:${vault.contractAddress.toLowerCase()}`,
          };
        }
      }
      return accum;
    },
    {}
  );

  // Modify the vault txs to use the base vault product key etc.
  // We have to sort since the timeline is not guaranteed to be in order after merge
  const vaultTxsWithBridgeMerged = sortBy(
    vaultTxsIgnoringBoosts.map((tx): VaultTimelineAnalyticsEntry => {
      const base = bridgeToBaseId[tx.productKey];
      if (base) {
        vaultIdsWithMerges.add(base.vaultId);
        return {
          ...tx,
          productKey: base.productKey,
          displayName: base.vaultId,
          vaultId: base.vaultId,
          chain: base.chainId,
          source: {
            productKey: tx.productKey,
            vaultId: tx.vaultId,
            chain: tx.chain,
          },
        };
      }

      return tx;
    }),
    tx => tx.datetime.getTime()
  );

  // Group txs by vault id
  const byVaultId = groupBy(vaultTxsWithBridgeMerged, tx => tx.vaultId);

  // Recalc balances for vaults we merged (boosts and bridge vaults)
  vaultIdsWithMerges.forEach(vaultId => {
    const txs = byVaultId[vaultId];
    if (txs && txs.length > 1) {
      for (let i = 1; i < txs.length; ++i) {
        const tx = txs[i];
        const prevTx = txs[i - 1];

        tx.shareBalance = prevTx.shareBalance.plus(tx.shareDiff);

        const underlyingPerShare = tx.shareDiff.isZero()
          ? BIG_ZERO
          : tx.underlyingDiff.dividedBy(tx.shareDiff).absoluteValue();
        tx.underlyingBalance = tx.shareBalance.multipliedBy(underlyingPerShare);

        // usd can be null if price was missing
        if (tx.usdDiff) {
          const usdPerShare = tx.shareDiff.isZero()
            ? BIG_ZERO
            : tx.usdDiff.dividedBy(tx.shareDiff).absoluteValue();
          tx.usdBalance = tx.shareBalance.multipliedBy(usdPerShare);
        } else {
          tx.usdBalance = prevTx.usdBalance;
        }
      }
    }
  });

  return byVaultId;
}

function handleCowcentratedTimeline(
  timeline: CLMTimelineAnalyticsEntryWithoutVaultId[],
  state: BeefyState
): Record<VaultEntity['id'], CLMTimelineAnalyticsEntry[]> {
  const vaultTxs = timeline.filter(tx => tx.productKey.startsWith('beefy:vault:'));

  const vaultTxsWithId = sortBy(
    vaultTxs.map(tx => {
      const vaultId = state.entities.vaults.byChainId[tx.chain]?.byAddress[tx.managerAddress];

      return { ...tx, vaultId: vaultId || tx.displayName };
    }),
    tx => tx.datetime.getTime()
  );

  return groupBy(vaultTxsWithId, tx => tx.vaultId);
}

export const fetchWalletTimeline = createAsyncThunk<
  FetchWalletTimelineFulfilled,
  { walletAddress: string },
  { state: BeefyState }
>(
  'analytics/fetchWalletTimeline',
  async ({ walletAddress }, { getState }) => {
    const api = await getAnalyticsApi();
    const { databarnTimeline, clmTimeline } = await api.getWalletTimeline(walletAddress);
    const state = getState();

    const databarnTimelineProcessed = handleDatabarnTimeline(
      databarnTimeline.map((row): VaultTimelineAnalyticsEntryWithoutVaultId => {
        return {
          type: 'standard',
          transactionId: makeTransactionId(row), // old data doesn't have transaction_hash
          datetime: new Date(row.datetime),
          productKey: row.product_key,
          displayName: row.display_name,
          chain: row.chain,
          isEol: row.is_eol,
          isDashboardEol: row.is_dashboard_eol,
          transactionHash: row.transaction_hash,
          shareBalance: new BigNumber(row.share_balance),
          shareDiff: new BigNumber(row.share_diff),
          shareToUnderlyingPrice: new BigNumber(row.share_to_underlying_price),
          underlyingBalance: new BigNumber(row.underlying_balance),
          underlyingDiff: new BigNumber(row.underlying_diff),
          underlyingToUsdPrice: isFiniteNumber(row.underlying_to_usd_price)
            ? new BigNumber(row.underlying_to_usd_price)
            : null,
          usdBalance: isFiniteNumber(row.usd_balance) ? new BigNumber(row.usd_balance) : null,
          usdDiff: isFiniteNumber(row.usd_diff) ? new BigNumber(row.usd_diff) : null,
        };
      }),
      state
    );

    const clmTimelineProcessed = handleCowcentratedTimeline(
      clmTimeline.map((row): CLMTimelineAnalyticsEntryWithoutVaultId => {
        const hasRewardPool =
          !!row.reward_pool_address && !!row.reward_pool_balance && !!row.reward_pool_diff;

        return {
          type: 'cowcentrated',
          transactionId: makeTransactionId(row),
          datetime: new Date(row.datetime),
          productKey: row.product_key,
          displayName: row.display_name,
          chain: row.chain,
          isEol: row.is_eol,
          isDashboardEol: row.is_dashboard_eol,
          transactionHash: row.transaction_hash,

          token0ToUsd: new BigNumber(row.token0_to_usd),
          underlying0Balance: new BigNumber(row.underlying0_balance),
          underlying0Diff: new BigNumber(row.underlying0_diff),

          token1ToUsd: new BigNumber(row.token1_to_usd),
          underlying1Balance: new BigNumber(row.underlying1_balance),
          underlying1Diff: new BigNumber(row.underlying1_diff),

          usdBalance: new BigNumber(row.usd_balance),
          usdDiff: new BigNumber(row.usd_diff),

          shareBalance: new BigNumber(row.share_balance),
          shareDiff: new BigNumber(row.share_diff),

          managerBalance: new BigNumber(row.manager_balance),
          managerDiff: new BigNumber(row.manager_diff),
          managerAddress: row.manager_address,

          rewardPoolBalance: hasRewardPool ? new BigNumber(row.reward_pool_balance!) : undefined,
          rewardPoolDiff: hasRewardPool ? new BigNumber(row.reward_pool_diff!) : undefined,
          rewardPoolAddress: hasRewardPool ? row.reward_pool_address! : undefined,

          actions: row.actions,
        };
      }),
      state
    );

    return {
      timelines: mergeAndPartitionTimelines(databarnTimelineProcessed, clmTimelineProcessed),
      walletAddress: walletAddress.toLowerCase(),
    };
  },
  {
    condition: ({ walletAddress }, { getState }) => {
      return !selectIsWalletTimelineForUserPending(getState(), walletAddress);
    },
  }
);

interface DataBarnPricesFulfilled {
  data: AnalyticsPriceResponse;
  vaultId: VaultEntity['id'];
  timebucket: TimeBucketType;
}

interface DataBarnPricesProps {
  timebucket: TimeBucketType;
  vaultId: VaultEntity['id'];
}

export const fetchShareToUnderlying = createAsyncThunk<
  DataBarnPricesFulfilled,
  DataBarnPricesProps,
  { state: BeefyState }
>('analytics/fetchShareToUnderlying', async ({ timebucket, vaultId }, { getState }) => {
  const state = getState();
  const vault = selectVaultById(state, vaultId);
  const api = await getAnalyticsApi();
  const data = await api.getVaultPrices(
    'vault',
    'share_to_underlying',
    timebucket,
    vault.contractAddress,
    vault.chainId
  );
  return {
    data,
    vaultId,
    timebucket,
  };
});

interface FetchClmHarvestsFulfilledAction {
  harvests: ApiClmHarvestPriceRow[];
  vaultId: VaultEntity['id'];
  chainId: ChainEntity['id'];
}

export const fetchClmHarvestsForUserVault = createAsyncThunk<
  FetchClmHarvestsFulfilledAction,
  { vaultId: VaultEntity['id']; walletAddress: string },
  { state: BeefyState }
>('analytics/fetchClmHarvestsForUserVault', async ({ vaultId }, { getState }) => {
  const state = getState();
  const { chainId, contractAddress: vaultAddress } = selectCowcentratedVaultById(state, vaultId);
  const api = await getClmApi();
  const harvests = await api.getHarvestsForVault(chainId, vaultAddress);
  return { harvests, vaultId, chainId };
});

/**
 * Dispatches a fetchClmHarvestsForUserChain action for each chain the user has deposited in a CLM vault
 */
export const fetchClmHarvestsForUser = createAsyncThunk<
  void,
  { walletAddress: string },
  { state: BeefyState }
>(
  'analytics/fetchClmHarvestsForUser',
  async ({ walletAddress }, { getState, dispatch }) => {
    if (!walletAddress) {
      console.error('Cannot fetch clm harvests for user without wallet address');
      return;
    }

    const state = getState();
    const chains = selectUserDepositedVaultIds(state, walletAddress)
      .map(vaultId => selectVaultById(state, vaultId))
      .filter(isCowcentratedVault)
      .filter(vault => selectUserHasCurrentDepositTimelineByVaultId(state, vault.id, walletAddress))
      .map(vault => ({
        id: vault.id,
        address: vault.contractAddress.toLowerCase(),
        chainId: vault.chainId,
      }))
      .reduce((acc, vault) => {
        acc.add(vault.chainId);
        return acc;
      }, new Set<ChainEntity['id']>());

    if (!chains.size) {
      console.info('User has no clm vault deposits to fetch harvests for');
      return;
    }

    await Promise.allSettled(
      [...chains].map(chainId =>
        dispatch(
          fetchClmHarvestsForUserChain({
            walletAddress,
            chainId,
          })
        )
      )
    );
  },
  {
    condition: ({ walletAddress }, { getState }) => {
      // don't run again if already pending
      return !selectIsClmHarvestsForUserPending(getState(), walletAddress);
    },
  }
);

type FetchClmHarvestsForUserFulfilledAction = FetchClmHarvestsFulfilledAction[];

/**
 * Fetches all harvests for all cowcentrated vaults the user has deposited in on a specific chain
 */
export const fetchClmHarvestsForUserChain = createAsyncThunk<
  FetchClmHarvestsForUserFulfilledAction,
  { walletAddress: string; chainId: ChainEntity['id'] },
  { state: BeefyState }
>(
  'analytics/fetchClmHarvestsForUserChain',
  async ({ walletAddress, chainId }, { getState }) => {
    const api = await getClmApi();
    const state = getState();
    const vaults = selectUserDepositedVaultIds(state, walletAddress)
      .map(vaultId => selectVaultById(state, vaultId))
      .filter(isCowcentratedVault)
      .filter(vault => vault.chainId === chainId)
      .map(vault => {
        const since = selectUserFirstDepositDateByVaultId(state, vault.id, walletAddress);
        return since
          ? {
              id: vault.id,
              address: vault.contractAddress.toLowerCase(),
              chainId: vault.chainId,
              since,
            }
          : undefined;
      })
      .filter(isDefined);

    if (!vaults.length) {
      return [];
    }

    const vaultsByAddress = keyBy(vaults, vault => vault.address);
    const vaultAddresses = Object.keys(vaultsByAddress);
    const earliest = vaults.reduce(
      (acc, vault) => (vault.since < acc ? vault.since : acc),
      vaults[0].since
    );
    const harvests = await api.getHarvestsForVaultsSince(chainId, vaultAddresses, earliest);

    return harvests.map(({ vaultAddress, harvests }) => {
      const vault = vaultsByAddress[vaultAddress];
      return { vaultId: vault.id, chainId: vault.chainId, harvests };
    });
  },
  {
    condition: ({ chainId, walletAddress }, { getState }) => {
      // don't run again if already pending
      return !selectIsClmHarvestsForUserChainPending(getState(), chainId, walletAddress);
    },
  }
);

export type ClmUserHarvestsTimelineHarvest = {
  timestamp: Date;
  /** price of tokens at this harvest, one entry per ClmHarvestTimeline['tokens'] */
  prices: BigNumber[];
  /** token amounts for this harvest, one entry per ClmHarvestTimeline['tokens'] */
  amounts: BigNumber[];
  /** usd amounts for this harvest, one entry per ClmHarvestTimeline['tokens'] */
  amountsUsd: BigNumber[];
  /** usd total for this harvest (sum of all amountsUsd) */
  totalUsd: BigNumber;
  /** cumulative token amounts for this harvest, one entry per ClmHarvestTimeline['tokens'] */
  cumulativeAmounts: BigNumber[];
  /** cumulative usd amounts for this harvest, one entry per ClmHarvestTimeline['tokens'] */
  cumulativeAmountsUsd: BigNumber[];
  /** cumulative total usd */
  cumulativeTotalUsd: BigNumber;
};

export type ClmUserHarvestsTimeline = {
  tokens: TokenEntity[];
  /** one entry per harvest */
  harvests: ClmUserHarvestsTimelineHarvest[];
  /** total token amounts, one entry per tokens */
  totals: BigNumber[];
  /** total usd amounts, one entry per tokens */
  totalsUsd: BigNumber[];
  /** overall total usd amount */
  totalUsd: BigNumber;
};

export type RecalculateClmHarvestsForUserVaultIdPayload = {
  vaultId: VaultEntity['id'];
  walletAddress: string;
  timeline: ClmUserHarvestsTimeline;
};

/**
 * Needs: User Timeline, Vault Harvests and User Balances
 */
export const recalculateClmHarvestsForUserVaultId = createAsyncThunk<
  RecalculateClmHarvestsForUserVaultIdPayload,
  { walletAddress: string; vaultId: VaultEntity['id'] },
  { state: BeefyState }
>(
  'analytics/recalculateClmHarvestsForUserVaultId',
  async ({ walletAddress, vaultId }, { getState }) => {
    const state = getState();
    const { token0, token1 } = selectCowcentratedVaultDepositTokens(state, vaultId);
    const result: RecalculateClmHarvestsForUserVaultIdPayload = {
      vaultId,
      walletAddress,
      timeline: {
        tokens: [token0, token1],
        harvests: [],
        totals: [BIG_ZERO, BIG_ZERO],
        totalsUsd: [BIG_ZERO, BIG_ZERO],
        totalUsd: BIG_ZERO,
      },
    };

    const timeline = selectUserDepositedTimelineByVaultId(state, vaultId, walletAddress);
    if (!timeline) {
      console.warn(`No timeline data found for vault ${vaultId}`);
      return result;
    }

    if (!isCLMTimelineAnalyticsEntity(timeline)) {
      console.warn(`Non CLM timeline found for vault ${vaultId}`);
      return result;
    }

    const harvests = selectClmHarvestsByVaultId(state, vaultId);
    if (!harvests) {
      console.warn(`No harvest data found for vault ${vaultId}`);
      return result;
    }

    if (timeline.current.length === 0) {
      console.warn(`No current timeline entries found for vault ${vaultId}`);
      return result;
    }

    const firstDeposit = timeline.current[0];
    const harvestsAfterDeposit = harvests.filter(h => isAfter(h.timestamp, firstDeposit.datetime));
    if (harvestsAfterDeposit.length === 0) {
      console.warn(`No harvests found after first deposit for vault ${vaultId}`);
      return result;
    }

    const lastTimelineIdx = timeline.current.length - 1;
    let timelineIdx = 0;
    for (const harvest of harvestsAfterDeposit) {
      let currentDeposit = timeline.current[timelineIdx];
      if (
        timelineIdx < lastTimelineIdx &&
        isAfter(harvest.timestamp, timeline.current[timelineIdx + 1].datetime)
      ) {
        currentDeposit = timeline.current[++timelineIdx];
      }

      const token0share = currentDeposit.shareBalance
        .multipliedBy(harvest.compoundedAmount0)
        .dividedBy(harvest.totalSupply);
      const token1share = currentDeposit.shareBalance
        .multipliedBy(harvest.compoundedAmount1)
        .dividedBy(harvest.totalSupply);

      const amounts = [token0share, token1share];
      const prices = [harvest.token0ToUsd, harvest.token1ToUsd];
      const amountsUsd = amounts.map((a, i) => a.multipliedBy(prices[i]));
      const totalUsd = amountsUsd.reduce((acc, a) => acc.plus(a), BIG_ZERO);
      const previous = result.timeline.harvests[result.timeline.harvests.length - 1];

      result.timeline.harvests.push({
        timestamp: harvest.timestamp,
        prices,
        amounts,
        amountsUsd,
        totalUsd,
        cumulativeAmounts: previous
          ? amounts.map((a, i) => a.plus(previous.cumulativeAmounts[i]))
          : amounts,
        cumulativeAmountsUsd: previous
          ? amountsUsd.map((a, i) => a.plus(previous.cumulativeAmountsUsd[i]))
          : amountsUsd,
        cumulativeTotalUsd: previous ? previous.cumulativeTotalUsd.plus(totalUsd) : totalUsd,
      });
    }

    if (result.timeline.harvests.length > 0) {
      const lastHarvest = result.timeline.harvests[result.timeline.harvests.length - 1];
      result.timeline.totals = lastHarvest.cumulativeAmounts;
      result.timeline.totalsUsd = lastHarvest.cumulativeAmountsUsd;
      result.timeline.totalUsd = lastHarvest.cumulativeTotalUsd;
    }

    return result;
  }
);

interface FetchClmPendingRewardsFulfilledAction {
  data: ClmPendingRewardsResponse;
  vaultId: VaultEntity['contractAddress'];
  chainId: ChainEntity['id'];
}

export const fetchClmPendingRewards = createAsyncThunk<
  FetchClmPendingRewardsFulfilledAction,
  { vaultId: VaultEntity['id'] },
  { state: BeefyState }
>('analytics/fetchClmPendingRewards', async ({ vaultId }, { getState }) => {
  const state = getState();
  const vault = selectVaultById(state, vaultId);

  const { chainId, contractAddress: vaultAddress } = vault;

  const { token0, token1 } = selectCowcentratedVaultDepositTokens(state, vaultId);

  const stratAddr = selectVaultStrategyAddressOrUndefined(state, vaultId);
  const api = await getClmApi();

  const { fees0, fees1, totalSupply } = await api.getClmPendingRewards(
    state,
    chainId,
    stratAddr,
    vaultAddress
  );

  return {
    data: {
      fees0: fees0.shiftedBy(-token0.decimals),
      fees1: fees1.shiftedBy(-token1.decimals),
      totalSupply: totalSupply.shiftedBy(-18),
    },
    chainId,
    vaultId,
  };
});

export const initDashboardByAddress = createAsyncThunk<
  { walletAddress: string },
  { walletAddress: string },
  { state: BeefyState }
>('analytics/initDashboardByAddress', async ({ walletAddress }, { getState, dispatch }) => {
  const state = getState();
  const chains = selectAllChainIds(state);
  const lowerCaseAddress = walletAddress.toLowerCase();
  const awaiter = new PromiseSettledAwaiter();

  for (const chainId of chains) {
    if (selectDashboardShouldLoadBalanceForChainUser(state, chainId, lowerCaseAddress)) {
      awaiter.add(dispatch(fetchAllBalanceAction({ chainId, walletAddress: lowerCaseAddress })));
    }
  }

  await awaiter.wait();

  return { walletAddress: lowerCaseAddress };
});
