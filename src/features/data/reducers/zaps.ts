import { createSlice } from '@reduxjs/toolkit';
import { fetchAllSwapAggregatorsAction, fetchAllZapsAction } from '../actions/zap';
import type { ChainEntity } from '../entities/chain';
import type { SwapAggregatorEntity, ZapEntity } from '../entities/zap';

export type ZapsState = {
  zaps: {
    byChainId: {
      [chainId: ChainEntity['id']]: ZapEntity;
    };
  };
  aggregators: {
    byId: {
      [aggregatorId: string]: SwapAggregatorEntity;
    };
    byChainId: {
      [chainId: ChainEntity['id']]: {
        byType: {
          [aggregatorType in SwapAggregatorEntity['type']]?: SwapAggregatorEntity['id'];
        };
      };
    };
  };
  tokens: {
    byChainId: {
      [chainId: ChainEntity['id']]: {
        scoreById: Record<string, number>;
      };
    };
  };
};

const initialZapsState: ZapsState = {
  zaps: {
    byChainId: {},
  },
  aggregators: {
    byId: {},
    byChainId: {},
  },
  tokens: {
    byChainId: {},
  },
};

export const zapsSlice = createSlice({
  name: 'zaps',
  initialState: initialZapsState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllZapsAction.fulfilled, (sliceState, action) => {
        for (const zap of action.payload.zaps) {
          sliceState.zaps.byChainId[zap.chainId] = zap;
        }
      })
      .addCase(fetchAllSwapAggregatorsAction.fulfilled, (sliceState, action) => {
        for (const aggregator of action.payload.aggregators) {
          // Aggregator
          sliceState.aggregators.byId[aggregator.id] = aggregator;
          if (!(aggregator.chainId in sliceState.aggregators.byChainId)) {
            sliceState.aggregators.byChainId[aggregator.chainId] = { byType: {} };
          }

          if (!(aggregator.type in sliceState.aggregators.byChainId[aggregator.chainId].byType)) {
            sliceState.aggregators.byChainId[aggregator.chainId].byType[aggregator.type] =
              aggregator.id;
          } else {
            console.warn(
              `Ignoring duplicate aggregator type ${aggregator.type} for chain ${aggregator.chainId}`
            );
          }

          // Priority Tokens
          if (!(aggregator.chainId in sliceState.tokens.byChainId)) {
            sliceState.tokens.byChainId[aggregator.chainId] = { scoreById: {} };
            for (const tokenId of aggregator.priorityTokens) {
              sliceState.tokens.byChainId[aggregator.chainId].scoreById[tokenId] =
                (sliceState.tokens.byChainId[aggregator.chainId].scoreById[tokenId] || 0) + 1;
            }
          }
        }
      });
  },
});
