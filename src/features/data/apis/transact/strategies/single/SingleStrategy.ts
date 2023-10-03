import type { IStrategy, SingleStrategyOptions, TransactHelpers } from '../IStrategy';
import type {
  InputTokenAmount,
  SingleDepositOption,
  SingleDepositQuote,
  SingleWithdrawOption,
  SingleWithdrawQuote,
  ZapQuoteStep,
} from '../../transact-types';
import type { BeefyThunk, GetStateFn } from '../../../../../../redux-types';
import { isTokenEqual, isTokenErc20 } from '../../../../entities/token';
import { TransactMode } from '../../../../reducers/wallet/transact-types';
import {
  createOptionId,
  createQuoteId,
  createSelectionId,
  onlyAssetCount,
  onlyInputCount,
  onlyVaultStandard,
} from '../../helpers/options';
import { first, uniqBy } from 'lodash-es';
import { BIG_ZERO, fromWei, toWeiString } from '../../../../../../helpers/big-number';
import { calculatePriceImpact } from '../../helpers/quotes';
import { selectTransactSlippage } from '../../../../selectors/transact';
import { walletActions } from '../../../../actions/wallet-actions';
import type { OrderInput, OrderOutput, UserlessZapRequest, ZapStep } from '../../zap/types';
import { getTokenAddress, NO_RELAY } from '../../helpers/zap';
import type { Step } from '../../../../reducers/wallet/stepper';
import type { Namespace, TFunction } from 'react-i18next';
import { getVaultWithdrawnFromState } from '../../helpers/vault';
import { isStandardVault } from '../../../../entities/vault';
import { slipBy } from '../../helpers/amounts';

export class SingleStrategy implements IStrategy {
  public readonly id = 'single';

  constructor(protected options: SingleStrategyOptions, protected helpers: TransactHelpers) {
    // Make sure zap was configured correctly for this vault
    const { vault } = this.helpers;

    onlyVaultStandard(vault);
    onlyAssetCount(vault, 1);
  }

  async initialize(): Promise<void> {}

  async aggregatorTokenSupport() {
    const { vault, vaultType, swapAggregator, getState, zap } = this.helpers;

    const state = getState();
    const tokenSupport = await swapAggregator.getTokenSupport(
      [vaultType.depositToken],
      vault.id,
      vault.chainId,
      state,
      this.options.swap
    );
    return tokenSupport.any;
  }

  async fetchDepositOptions(): Promise<SingleDepositOption[]> {
    const { vault, vaultType } = this.helpers;
    const supportedAggregatorTokens = await this.aggregatorTokenSupport();
    const tokens = supportedAggregatorTokens.filter(
      token => !isTokenEqual(token, vaultType.depositToken)
    );
    const outputs = [vaultType.depositToken];

    return tokens.map(token => {
      const inputs = [token];
      const selectionId = createSelectionId(vault.chainId, inputs);

      return {
        id: createOptionId('single', vault.id, selectionId),
        vaultId: vault.id,
        chainId: vault.chainId,
        selectionId,
        inputs,
        wantedOutputs: outputs,
        strategyId: 'single',
        mode: TransactMode.Deposit,
      };
    });
  }

  async fetchDepositQuote(
    inputs: InputTokenAmount[],
    option: SingleDepositOption
  ): Promise<SingleDepositQuote> {
    onlyInputCount(inputs, 1);

    const { vault, vaultType, swapAggregator, zap, getState } = this.helpers;

    // Input
    const input = first(inputs);
    if (input.amount.lte(BIG_ZERO)) {
      throw new Error('Single strategy: Quote called with 0 input amount');
    }

    // Token Allowances
    const allowances = isTokenErc20(input.token)
      ? [
          {
            token: input.token,
            amount: input.amount,
            spenderAddress: zap.manager,
          },
        ]
      : [];

    // Swap + Output
    const state = getState();
    const swapQuotes = await swapAggregator.fetchQuotes(
      {
        vaultId: vault.id,
        fromToken: input.token,
        fromAmount: input.amount,
        toToken: vaultType.depositToken,
      },
      state
    );
    const bestQuote = first(swapQuotes); // already sorted by toAmount
    const outputs = [{ token: vaultType.depositToken, amount: bestQuote.toAmount }];
    const steps: ZapQuoteStep[] = [
      {
        type: 'swap',
        fromToken: bestQuote.fromToken,
        fromAmount: bestQuote.fromAmount,
        toToken: bestQuote.toToken,
        toAmount: bestQuote.toAmount,
        via: 'aggregator',
        providerId: bestQuote.providerId,
        fee: bestQuote.fee,
      },
      {
        type: 'deposit',
        token: bestQuote.toToken,
        amount: bestQuote.toAmount,
      },
    ];

    if (bestQuote.fromAmount.lt(input.amount)) {
      outputs.push({
        token: input.token,
        amount: input.amount.minus(bestQuote.fromAmount),
      });
    }

    return {
      id: createQuoteId(option.id),
      strategyId: 'single',
      swapQuote: bestQuote,
      priceImpact: calculatePriceImpact(inputs, outputs, state), // TODO? this includes the zap fee...
      option,
      inputs,
      outputs,
      returned: [],
      allowances,
      steps,
      fee: bestQuote.fee,
    };
  }

  async fetchDepositStep(quote: SingleDepositQuote, t: TFunction<Namespace>): Promise<Step> {
    const { vaultType, zap, swapAggregator } = this.helpers;

    const zapAction: BeefyThunk = async (dispatch, getState, extraArgument) => {
      const state = getState();
      const slippage = selectTransactSlippage(state);

      // Step 1. Swap
      const swap = await swapAggregator.fetchSwap(
        quote.swapQuote.providerId,
        {
          fromAddress: zap.router,
          fromToken: quote.swapQuote.fromToken,
          fromAmount: quote.swapQuote.fromAmount,
          toToken: quote.swapQuote.toToken,
          slippage,
        },
        state
      );

      const steps: ZapStep[] = [
        {
          target: swap.tx.toAddress,
          value: swap.tx.value,
          data: swap.tx.data,
          tokens: [
            {
              token: getTokenAddress(swap.fromToken),
              index: -1, // not dynamically inserted
            },
          ],
        },
      ];

      // Step 2. Deposit to vault
      const vaultDeposit = await vaultType.fetchZapDeposit({
        inputs: [
          {
            token: swap.toToken,
            amount: slipBy(swap.toAmount, slippage, swap.toToken.decimals), // we pass min after swap slippage here, but zap will use all
          },
        ],
      });

      steps.push(vaultDeposit.zap);

      // Build order
      const inputs: OrderInput[] = quote.inputs.map(input => ({
        token: input.token.address,
        amount: toWeiString(input.amount, input.token.decimals),
      }));

      const requiredOutputs: OrderOutput[] = vaultDeposit.outputs.map(output => ({
        token: getTokenAddress(output.token),
        minOutputAmount: toWeiString(
          slipBy(output.amount, slippage, output.token.decimals),
          output.token.decimals
        ),
      }));

      // We need to list all inputs, and mid-route outputs, as outputs so dust gets returned
      const dustOutputs: OrderOutput[] = quote.outputs.concat(quote.inputs).map(input => ({
        token: getTokenAddress(input.token),
        minOutputAmount: '0',
      }));

      // @dev uniqBy: first occurrence of each element is kept.
      const outputs = uniqBy(requiredOutputs.concat(dustOutputs), output => output.token);

      // Perform TX
      const zapRequest: UserlessZapRequest = {
        order: {
          inputs,
          outputs,
          relay: NO_RELAY,
        },
        steps,
      };

      const walletAction = walletActions.zapExecuteOrder(quote.option.vaultId, zapRequest);

      return walletAction(dispatch, getState, extraArgument);
    };

    return {
      step: 'zap-in',
      message: t('Vault-TxnConfirm', { type: t('Deposit-noun') }),
      action: zapAction,
      pending: false,
      extraInfo: { zap: true, vaultId: quote.option.vaultId },
    };
  }

  async fetchWithdrawOptions(): Promise<SingleWithdrawOption[]> {
    const { vault, vaultType } = this.helpers;
    const supportedAggregatorTokens = await this.aggregatorTokenSupport();
    const tokens = supportedAggregatorTokens.filter(
      token => !isTokenEqual(token, vaultType.depositToken)
    );
    const inputs = [vaultType.depositToken];

    return tokens.map(token => {
      const outputs = [token];
      const selectionId = createSelectionId(vault.chainId, outputs);

      return {
        id: createOptionId('single', vault.id, selectionId),
        vaultId: vault.id,
        chainId: vault.chainId,
        selectionId,
        inputs,
        wantedOutputs: outputs,
        strategyId: 'single',
        mode: TransactMode.Withdraw,
      };
    });
  }

  async fetchWithdrawQuote(
    inputs: InputTokenAmount[],
    option: SingleWithdrawOption
  ): Promise<SingleWithdrawQuote> {
    onlyInputCount(inputs, 1);

    const { vault, swapAggregator, zap, getState } = this.helpers;
    if (!isStandardVault(vault)) {
      throw new Error('Single strategy: Vault is not standard');
    }

    // Input
    const input = first(inputs);
    if (input.amount.lte(BIG_ZERO)) {
      throw new Error('Single strategy: Quote called with 0 input amount');
    }

    // Token Allowances
    const state = getState();
    const { withdrawnAmountAfterFeeWei, withdrawnToken, shareToken, sharesToWithdrawWei } =
      getVaultWithdrawnFromState(input, vault, state);
    const withdrawnAmountAfterFee = fromWei(withdrawnAmountAfterFeeWei, withdrawnToken.decimals);
    const allowances = isTokenErc20(input.token)
      ? [
          {
            token: shareToken,
            amount: fromWei(sharesToWithdrawWei, shareToken.decimals),
            spenderAddress: zap.manager,
          },
        ]
      : [];

    // Swap + Output
    const output = first(option.wantedOutputs);
    const swapQuotes = await swapAggregator.fetchQuotes(
      {
        vaultId: vault.id,
        fromToken: withdrawnToken,
        fromAmount: withdrawnAmountAfterFee,
        toToken: output,
      },
      state
    );
    const bestQuote = first(swapQuotes); // already sorted by toAmount
    const outputs = [{ token: bestQuote.toToken, amount: bestQuote.toAmount }];
    const steps: ZapQuoteStep[] = [
      {
        type: 'withdraw',
        token: bestQuote.fromToken,
        amount: bestQuote.fromAmount,
      },
      {
        type: 'swap',
        fromToken: bestQuote.fromToken,
        fromAmount: bestQuote.fromAmount,
        toToken: bestQuote.toToken,
        toAmount: bestQuote.toAmount,
        via: 'aggregator',
        providerId: bestQuote.providerId,
        fee: bestQuote.fee,
      },
    ];

    if (bestQuote.fromAmount.lt(input.amount)) {
      outputs.push({
        token: input.token,
        amount: input.amount.minus(bestQuote.fromAmount),
      });
    }

    return {
      id: createQuoteId(option.id),
      strategyId: 'single',
      swapQuote: bestQuote,
      priceImpact: calculatePriceImpact(inputs, outputs, state), // TODO? this includes the zap fee...
      option,
      inputs,
      outputs,
      returned: [],
      allowances,
      steps,
      fee: bestQuote.fee,
    };
  }

  async fetchWithdrawStep(quote: SingleWithdrawQuote, t: TFunction<Namespace>): Promise<Step> {
    const { vaultType, zap, swapAggregator } = this.helpers;

    const zapAction: BeefyThunk = async (dispatch, getState, extraArgument) => {
      const state = getState();
      const slippage = selectTransactSlippage(state);

      // Step 1. Withdraw from vault
      const vaultWithdraw = await vaultType.fetchZapWithdraw({
        inputs: quote.inputs,
      });
      if (vaultWithdraw.outputs.length !== 1) {
        throw new Error('Single strategy: Withdraw output count mismatch');
      }

      const withdrawOutput = first(vaultWithdraw.outputs);
      if (!isTokenEqual(withdrawOutput.token, quote.swapQuote.fromToken)) {
        throw new Error('Single strategy: Withdraw output token mismatch');
      }

      const steps: ZapStep[] = [vaultWithdraw.zap];

      // Step 2. Swap
      const swap = await swapAggregator.fetchSwap(
        quote.swapQuote.providerId,
        {
          fromAddress: zap.router,
          fromToken: withdrawOutput.token,
          fromAmount: withdrawOutput.amount,
          toToken: quote.swapQuote.toToken,
          slippage: slippage,
        },
        state
      );

      if (swap.toAmount.lt(quote.swapQuote.toAmount)) {
        // We just did a quote before fetching a swap, so this should never happen
        throw new Error('Single strategy: Swap output amount mismatch');
      }

      const swapStep: ZapStep = {
        target: swap.tx.toAddress,
        value: swap.tx.value,
        data: swap.tx.data,
        tokens: [
          {
            token: getTokenAddress(swap.fromToken),
            index: -1, // not dynamically inserted
          },
        ],
      };

      steps.push(swapStep);

      // Build order (note: input to order is shares, but quote inputs are the deposit token)
      const inputs: OrderInput[] = vaultWithdraw.inputs.map(input => ({
        token: input.token.address,
        amount: toWeiString(input.amount, input.token.decimals),
      }));

      // The required output is the swap output
      const requiredOutputs: OrderOutput[] = [
        {
          token: getTokenAddress(swap.toToken),
          minOutputAmount: toWeiString(
            slipBy(swap.toAmount, slippage, swap.toToken.decimals),
            swap.toToken.decimals
          ),
        },
      ];

      // Possible dust (shareToken [withdraw input[, depositToken [withdraw output, swap input])
      const dustOutputs: OrderOutput[] = vaultWithdraw.outputs
        .concat(vaultWithdraw.inputs)
        .map(input => ({
          token: getTokenAddress(input.token),
          minOutputAmount: '0',
        }));

      // @dev uniqBy: first occurrence of each element is kept.
      const outputs = uniqBy(requiredOutputs.concat(dustOutputs), output => output.token);

      // Perform TX
      const zapRequest: UserlessZapRequest = {
        order: {
          inputs,
          outputs,
          relay: NO_RELAY,
        },
        steps,
      };

      const walletAction = walletActions.zapExecuteOrder(quote.option.vaultId, zapRequest);

      return walletAction(dispatch, getState, extraArgument);
    };

    return {
      step: 'zap-out',
      message: t('Vault-TxnConfirm', { type: t('Withdraw-noun') }),
      action: zapAction,
      pending: false,
      extraInfo: { zap: true, vaultId: quote.option.vaultId },
    };
  }
}
