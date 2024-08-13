import type { IVaultType } from '../../vaults/IVaultType';
import type { IStrategy } from '../IStrategy';
import type {
  DepositOption,
  DepositQuote,
  InputTokenAmount,
  WithdrawOption,
  WithdrawQuote,
} from '../../transact-types';
import type { Step } from '../../../../reducers/wallet/stepper';
import type { Namespace, TFunction } from 'react-i18next';

const strategyId = 'vault' as const;
type StrategyId = typeof strategyId;

/**
 * This is just a wrapper around IVaultType to make it an IStrategy
 * It does not need to conform to IZapStrategy
 */
export class VaultStrategy<T extends IVaultType> implements IStrategy<StrategyId> {
  public static readonly id = strategyId;
  public readonly id = strategyId;

  constructor(protected readonly vaultType: T) {}

  async fetchDepositOptions(): Promise<DepositOption[]> {
    return [await this.vaultType.fetchDepositOption()];
  }

  async fetchDepositQuote(
    inputs: InputTokenAmount[],
    option: DepositOption
  ): Promise<DepositQuote> {
    return this.vaultType.fetchDepositQuote(inputs, option);
  }

  async fetchDepositStep(quote: DepositQuote, t: TFunction<Namespace>): Promise<Step> {
    return this.vaultType.fetchDepositStep(quote, t);
  }

  async fetchWithdrawOptions(): Promise<WithdrawOption[]> {
    return [await this.vaultType.fetchWithdrawOption()];
  }

  async fetchWithdrawQuote(
    inputs: InputTokenAmount[],
    option: WithdrawOption
  ): Promise<WithdrawQuote> {
    return this.vaultType.fetchWithdrawQuote(inputs, option);
  }

  async fetchWithdrawStep(quote: WithdrawQuote, t: TFunction<Namespace>): Promise<Step> {
    return this.vaultType.fetchWithdrawStep(quote, t);
  }
}
