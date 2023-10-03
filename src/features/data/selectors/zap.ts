import type { BeefyState } from '../../../redux-types';
import type { ChainEntity } from '../entities/chain';
import { createSelector } from '@reduxjs/toolkit';
import type { SwapAggregatorEntity } from '../entities/zap';
import type { TokenEntity } from '../entities/token';

export const selectZapByChainId = (state: BeefyState, chainId: ChainEntity['id']) =>
  state.entities.zaps.zaps.byChainId[chainId] || undefined;

export const selectSwapAggregatorById = (state: BeefyState, id: SwapAggregatorEntity['id']) =>
  state.entities.zaps.aggregators.byId[id] || undefined;

export const selectSwapAggregatorsForChain = createSelector(
  (state: BeefyState, chainId: ChainEntity['id']) =>
    state.entities.zaps.aggregators.byChainId[chainId]?.byType,
  (state: BeefyState) => state.entities.zaps.aggregators.byId,
  (byType, byId): SwapAggregatorEntity[] => {
    if (!byType) {
      return [];
    }

    return Object.values(byType).map(id => byId[id]);
  }
);

export const selectOneInchSwapAggregatorForChain = (
  state: BeefyState,
  chainId: ChainEntity['id']
) => {
  return selectSwapAggregatorForChainType(state, chainId, 'one-inch');
};

export const selectSwapAggregatorForChainType = <T extends SwapAggregatorEntity>(
  state: BeefyState,
  chainId: ChainEntity['id'],
  type: T['type']
): T => {
  const id = state.entities.zaps.aggregators.byChainId[chainId]?.byType[type];
  return id ? (state.entities.zaps.aggregators.byId[id] as T) : undefined;
};

export const selectZapTokenScoresByChainId = (
  state: BeefyState,
  chainId: ChainEntity['id']
): Record<TokenEntity['id'], number> =>
  state.entities.zaps.tokens.byChainId[chainId]?.scoreById || {};

export const selectZapTokenScore = (
  state: BeefyState,
  chainId: ChainEntity['id'],
  tokenId: TokenEntity['id']
): number => state.entities.zaps.tokens.byChainId[chainId]?.scoreById[tokenId] || 0;
