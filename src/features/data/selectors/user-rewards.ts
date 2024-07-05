import type { BeefyState } from '../../../redux-types';
import { type VaultEntity } from '../entities/vault';
import type { ChainEntity } from '../entities/chain';
import type { MerklVaultReward } from '../reducers/wallet/user-rewards';
import type { BigNumber } from 'bignumber.js';
import type { TokenEntity } from '../entities/token';
import { BIG_ZERO } from '../../../helpers/big-number';
import { createSelector } from '@reduxjs/toolkit';
import { selectVaultById } from './vaults';
import { selectTokenByAddressOrUndefined, selectTokenPriceByTokenOracleId } from './tokens';
import { selectWalletAddress } from './wallet';
import { selectVaultActiveGovRewards, selectVaultActiveMerklCampaigns } from './rewards';
import { selectGovVaultPendingRewards, selectGovVaultPendingRewardsWithPrice } from './balance';

type UnifiedRewardToken = Pick<TokenEntity, 'address' | 'symbol' | 'decimals' | 'chainId'>;

export type UnifiedReward = {
  active: boolean;
  balance: BigNumber;
  token: UnifiedRewardToken;
  price: BigNumber | undefined;
  apr: number | undefined;
};

type SimpleToken = Omit<UnifiedRewardToken, 'chainId'>;

function selectUnifiedMerklReward(
  state: BeefyState,
  balance: BigNumber,
  chainId: ChainEntity['id'],
  token: SimpleToken,
  active: boolean,
  apr: number | undefined
): UnifiedReward {
  const abToken = selectTokenByAddressOrUndefined(state, chainId, token.address);
  const price = abToken ? selectTokenPriceByTokenOracleId(state, abToken.oracleId) : undefined;

  return {
    balance,
    token: abToken ?? {
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      chainId,
    },
    price,
    active,
    apr,
  };
}

function selectUnifiedMerklRewards(
  state: BeefyState,
  chainId: ChainEntity['id'],
  rewards: MerklVaultReward[]
): UnifiedReward[] {
  return rewards.map(reward =>
    selectUnifiedMerklReward(state, reward.unclaimed, chainId, reward, false, undefined)
  );
}

export function selectUserMerklUnifiedRewardsForVault(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  walletAddress?: string
) {
  const vault = selectVaultById(state, vaultId);
  const unclaimedRewards = walletAddress
    ? state.user.rewards.byUser[walletAddress.toLowerCase()]?.byProvider.merkl.byVaultId[
        vaultId
      ]?.filter(r => r.unclaimed.gt(BIG_ZERO))
    : undefined;
  const activeCampaigns = selectVaultActiveMerklCampaigns(state, vaultId);

  if (!unclaimedRewards && !activeCampaigns) {
    return undefined;
  }

  const rewards: UnifiedReward[] =
    unclaimedRewards && unclaimedRewards.length > 0
      ? selectUnifiedMerklRewards(state, vault.chainId, unclaimedRewards)
      : [];

  if (activeCampaigns) {
    for (const campaign of activeCampaigns) {
      const existing = rewards.find(r => r.token.address === campaign.rewardToken.address);
      if (existing) {
        existing.active = true;
        existing.apr = (existing.apr || 0) + campaign.apr;
      } else {
        rewards.push(
          selectUnifiedMerklReward(
            state,
            BIG_ZERO,
            vault.chainId,
            campaign.rewardToken,
            true,
            campaign.apr
          )
        );
      }
    }
  }

  return rewards;
}

export function selectUserMerklUnifiedRewardsForChain(
  state: BeefyState,
  chainId: ChainEntity['id'],
  walletAddress: string
) {
  const chainRewards =
    state.user.rewards.byUser[walletAddress.toLowerCase()]?.byProvider.merkl.byChain[chainId];
  if (!chainRewards) {
    return undefined;
  }

  const rewards = Object.values(chainRewards.byTokenAddress).filter(r => r.unclaimed.gt(BIG_ZERO));
  return selectUnifiedMerklRewards(state, chainId, rewards);
}

const selectUserMerklRewardsForVault = (
  state: BeefyState,
  vaultId: VaultEntity['id'],
  walletAddress: string
) =>
  state.user.rewards.byUser[walletAddress.toLowerCase()]?.byProvider.merkl.byVaultId[vaultId] ||
  undefined;

const selectConnectedUserMerklRewardsForVault = createSelector(
  (state: BeefyState, vaultId: VaultEntity['id']) => vaultId,
  (state: BeefyState) => state.user.rewards.byUser,
  (state: BeefyState) => selectWalletAddress(state),
  (vaultId, rewardsByUser, walletAddress) => {
    if (!walletAddress) {
      return undefined;
    }

    return (
      rewardsByUser[walletAddress.toLowerCase()]?.byProvider.merkl.byVaultId[vaultId] || undefined
    );
  }
);

export const selectUserHasMerklRewardsForVault = createSelector(
  selectUserMerklRewardsForVault,
  rewards => rewards?.some(r => r.unclaimed.gt(BIG_ZERO)) || false
);

export const selectConnectedUserHasMerklRewardsForVault = createSelector(
  selectConnectedUserMerklRewardsForVault,
  rewards => rewards?.some(r => r.unclaimed.gt(BIG_ZERO)) || false
);
export const selectConnectedUserHasGovRewardsForVault = (
  state: BeefyState,
  vaultId: VaultEntity['id'],
  walletAddress?: string
) => {
  walletAddress = walletAddress || selectWalletAddress(state);
  if (!walletAddress) {
    return false;
  }

  const rewards = selectGovVaultPendingRewards(state, vaultId, walletAddress);
  return rewards && rewards.some(r => r.amount.gt(BIG_ZERO));
};

export const selectUserGovVaultUnifiedRewards = createSelector(
  selectGovVaultPendingRewardsWithPrice,
  (state: BeefyState, vaultId: VaultEntity['id'], _walletAddress?: string) =>
    selectVaultActiveGovRewards(state, vaultId),
  (pendingRewards, activeRewards): UnifiedReward[] => {
    const rewards: UnifiedReward[] =
      pendingRewards && pendingRewards.length
        ? pendingRewards.map(r => ({
            ...r,
            balance: r.amount,
            active: false,
            apr: undefined,
          }))
        : [];

    if (activeRewards && activeRewards.length) {
      for (const reward of activeRewards) {
        const existing = rewards.find(r => r.token.address === reward.token.address);
        if (existing) {
          existing.active = true;
          existing.apr = reward.apr;
        } else {
          rewards.push({
            balance: BIG_ZERO,
            token: reward.token,
            price: reward.price,
            active: true,
            apr: reward.apr,
          });
        }
      }
    }

    return rewards;
  }
);
