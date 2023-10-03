import { createAsyncThunk } from '@reduxjs/toolkit';
import type { BeefyState } from '../../../redux-types';
import { getConfigApi } from '../apis/instances';
import type { SwapAggregatorConfig, ZapConfig } from '../apis/config-types';

interface FetchAllZapsFulfilledPayload {
  zaps: ZapConfig[];
}

export const fetchAllZapsAction = createAsyncThunk<
  FetchAllZapsFulfilledPayload,
  void,
  { state: BeefyState }
>('zap/fetchAllZapsAction', async () => {
  const api = getConfigApi();
  const zaps = await api.fetchZapsConfig();

  return { zaps };
});

interface FetchAllSwapAggregatorsFulfilledPayload {
  aggregators: SwapAggregatorConfig[];
}

export const fetchAllSwapAggregatorsAction = createAsyncThunk<
  FetchAllSwapAggregatorsFulfilledPayload,
  void,
  { state: BeefyState }
>('zap/fetchAllSwapAggregatorsAction', async () => {
  const api = getConfigApi();
  const aggregators = await api.fetchSwapAggregatorsConfig();

  return { aggregators };
});
