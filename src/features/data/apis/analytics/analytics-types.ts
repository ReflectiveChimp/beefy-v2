import type BigNumber from 'bignumber.js';
import type { ChainEntity } from '../../entities/chain';

export interface CommonTimelineAnalyticsConfig {
  chain: ChainEntity['id'];
  datetime: string;
  display_name: string;
  is_dashboard_eol: boolean;
  is_eol: boolean;
  product_key: string;
}

export type TimelineAnalyticsConfig = CommonTimelineAnalyticsConfig & {
  transaction_hash: string | null;
  share_balance: number;
  share_diff: number;
  usd_balance: number | null;
  usd_diff: number | null;
  share_to_underlying_price: number;
  underlying_balance: number;
  underlying_diff: number;
  underlying_to_usd_price: number | null;
};

export type CLMTimelineAnalyticsAction =
  | 'MANAGER_DEPOSIT'
  | 'MANAGER_WITHDRAW'
  | 'REWARD_POOL_STAKE'
  | 'REWARD_POOL_UNSTAKE'
  | 'REWARD_POOL_CLAIM';

export type CLMTimelineAnalyticsConfig = CommonTimelineAnalyticsConfig & {
  transaction_hash: string;

  /** total clm + reward pool balance */
  share_balance: string;
  share_diff: string;

  token0_to_usd: string;
  underlying0_balance: string;
  underlying0_diff: string;

  token1_to_usd: string;
  underlying1_balance: string;
  underlying1_diff: string;

  usd_balance: string;
  usd_diff: string;

  /** balance of the clm receipt token */
  manager_balance: string;
  manager_diff: string;
  manager_address: string;

  /** balance of the reward pool receipt token */
  reward_pool_balance: string | null;
  reward_pool_diff: string | null;
  reward_pool_address: string | null;

  actions: CLMTimelineAnalyticsAction[];
};

export type AnalyticsUserTimelineResponse = {
  clmTimeline: CLMTimelineAnalyticsConfig[];
  databarnTimeline: TimelineAnalyticsConfig[];
};

export interface PriceAnalyticsConfig {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export interface ApiProductPriceRow {
  date: Date;
  value: BigNumber;
}

export type PriceType = 'share_to_underlying' | 'underlying_to_usd' | 'pending_rewards_to_usd';

export type TimeBucketType = '1h_1d' | '1h_1w' | '1h_1M' | '4h_3M' | '1d_1M' | '1d_1Y' | '1d_all';

export type AnalyticsPriceResponse = ApiProductPriceRow[];
