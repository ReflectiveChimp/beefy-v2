import { isStandardVault, VaultEntity, VaultStandard } from '../../../entities/vault';
import type { BeefyState, GetStateFn } from '../../../../../redux-types';
import { selectTokenByAddress } from '../../../selectors/tokens';
import type {
  IStandardVaultType,
  VaultDepositRequest,
  VaultDepositResponse,
  VaultWithdrawRequest,
  VaultWithdrawResponse,
} from './IVaultType';
import {
  isTokenEqual,
  isTokenErc20,
  isTokenNative,
  TokenEntity,
  TokenErc20,
} from '../../../entities/token';
import {
  createOptionId,
  createQuoteId,
  createSelectionId,
  onlyInputCount,
} from '../helpers/options';
import type {
  InputTokenAmount,
  StandardVaultDepositOption,
  StandardVaultDepositQuote,
  StandardVaultWithdrawOption,
  StandardVaultWithdrawQuote,
  TokenAmount,
  TransactQuote,
} from '../transact-types';
import { TransactMode } from '../../../reducers/wallet/transact-types';
import { first } from 'lodash-es';
import { BIG_ZERO, bigNumberToStringDeep, fromWei, toWei } from '../../../../../helpers/big-number';
import { selectFeesByVaultId } from '../../../selectors/fees';
import { selectChainById } from '../../../selectors/chains';
import { getWeb3Instance } from '../../instances';
import { VaultAbi } from '../../../../../config/abi';
import { BigNumber } from 'bignumber.js';
import abiCoder from 'web3-eth-abi';
import { getInsertIndex, getTokenAddress } from '../helpers/zap';
import { walletActions } from '../../../actions/wallet-actions';
import type { Namespace, TFunction } from 'react-i18next';
import type { Step } from '../../../reducers/wallet/stepper';
import { MultiCall } from 'eth-multicall';
import { getVaultWithdrawnFromContract, getVaultWithdrawnFromState } from '../helpers/vault';
import { selectWalletAddress } from '../../../selectors/wallet';

export class StandardVaultType implements IStandardVaultType {
  public readonly id = 'standard';
  public readonly vault: VaultStandard;
  public readonly depositToken: TokenEntity;
  public readonly shareToken: TokenErc20;
  protected readonly getState: GetStateFn;

  constructor(vault: VaultEntity, getState: GetStateFn) {
    if (!isStandardVault(vault)) {
      throw new Error('Vault is not a standard vault');
    }

    const state = getState();
    this.getState = getState;
    this.vault = vault;
    this.depositToken = selectTokenByAddress(state, vault.chainId, vault.depositTokenAddress);

    const shareToken = selectTokenByAddress(state, vault.chainId, vault.earnContractAddress);
    if (!isTokenErc20(shareToken)) {
      throw new Error('Share token is not an ERC20 token');
    }
    this.shareToken = shareToken;
  }

  async initialize(): Promise<void> {}

  protected calculateDepositFee(input: TokenAmount, state: BeefyState): BigNumber {
    const { deposit: depositFeePercent } = selectFeesByVaultId(state, this.vault.id);
    return depositFeePercent > 0
      ? input.amount
          .multipliedBy(depositFeePercent)
          .decimalPlaces(input.token.decimals, BigNumber.ROUND_FLOOR)
      : BIG_ZERO;
  }

  async fetchZapDeposit(request: VaultDepositRequest): Promise<VaultDepositResponse> {
    onlyInputCount(request.inputs, 1);

    const input = first(request.inputs);
    if (!isTokenEqual(input.token, this.depositToken)) {
      throw new Error('Input token is not the deposit token');
    }

    if (isTokenNative(input.token)) {
      throw new Error('Input token is not native **TODO support**'); // TODO support native
    }

    const state = this.getState();
    const chain = selectChainById(state, this.vault.chainId);
    const web3 = await getWeb3Instance(chain);
    const vaultContract = new web3.eth.Contract(VaultAbi, this.vault.earnContractAddress);
    const ppfsRaw = await vaultContract.methods.getPricePerFullShare().call();
    const ppfs = new BigNumber(ppfsRaw);
    const inputWei = toWei(input.amount, input.token.decimals);
    const depositFee = this.calculateDepositFee(input, state);
    const inputWeiAfterFee = toWei(input.amount.minus(depositFee), input.token.decimals);
    const expectedShares = inputWeiAfterFee
      .shiftedBy(this.shareToken.decimals)
      .dividedToIntegerBy(ppfs);

    console.log(
      bigNumberToStringDeep({
        ppfsRaw,
        inputWei,
        inputWeiAfterFee,
        expectedShares,
      })
    );

    return {
      inputs: request.inputs,
      outputs: [
        {
          token: this.shareToken,
          amount: fromWei(expectedShares, this.shareToken.decimals),
        },
      ],
      zap: {
        target: this.vault.earnContractAddress,
        value: isTokenNative(input.token) ? inputWei.toString(10) : '0',
        data: abiCoder.encodeFunctionCall(
          {
            constant: false,
            inputs: [
              {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
              },
            ],
            name: 'deposit', // TODO native?
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          [inputWei.toString(10)]
        ),
        tokens: [
          {
            token: getTokenAddress(input.token),
            index: getInsertIndex(0),
          },
        ],
      },
    };
  }

  async fetchDepositOption(): Promise<StandardVaultDepositOption> {
    const inputs = [this.depositToken];
    const selectionId = createSelectionId(this.vault.chainId, inputs);

    return {
      id: createOptionId('vault-standard', this.vault.id, selectionId),
      vaultId: this.vault.id,
      chainId: this.vault.chainId,
      selectionId,
      inputs,
      wantedOutputs: inputs,
      strategyId: 'vault',
      vaultType: 'standard',
      mode: TransactMode.Deposit,
    };
  }

  async fetchDepositQuote(
    inputs: InputTokenAmount[],
    option: StandardVaultDepositOption
  ): Promise<StandardVaultDepositQuote> {
    onlyInputCount(inputs, 1);

    const input = first(inputs);
    if (input.amount.lte(BIG_ZERO)) {
      throw new Error('Quote called with 0 input amount');
    }

    if (!isTokenEqual(input.token, this.depositToken)) {
      throw new Error('Quote called with invalid input token');
    }

    const state = this.getState();
    const fee = this.calculateDepositFee(input, state);
    const output = {
      token: input.token,
      amount: input.amount.minus(fee),
    };
    const allowances = isTokenErc20(input.token)
      ? [
          {
            token: input.token,
            amount: input.amount,
            spenderAddress: this.vault.earnContractAddress,
          },
        ]
      : [];

    return {
      id: createQuoteId(option.id),
      strategyId: option.strategyId,
      vaultType: option.vaultType,
      option,
      inputs,
      outputs: [output],
      returned: [],
      allowances,
      priceImpact: 0,
    };
  }

  async fetchDepositStep(quote: TransactQuote, t: TFunction<Namespace>): Promise<Step> {
    onlyInputCount(quote.inputs, 1);

    const input = first(quote.inputs);

    return {
      step: 'deposit',
      message: t('Vault-TxnConfirm', { type: t('Deposit-noun') }),
      action: walletActions.deposit(this.vault, input.amount, input.max),
      pending: false,
      extraInfo: { zap: false, vaultId: quote.option.vaultId },
    };
  }

  async fetchWithdrawOption(): Promise<StandardVaultWithdrawOption> {
    const inputs = [this.depositToken];
    const selectionId = createSelectionId(this.vault.chainId, inputs);

    return {
      id: createOptionId('vault-standard', this.vault.id, selectionId),
      vaultId: this.vault.id,
      chainId: this.vault.chainId,
      selectionId,
      inputs,
      wantedOutputs: inputs,
      strategyId: 'vault',
      vaultType: 'standard',
      mode: TransactMode.Withdraw,
    };
  }

  async fetchWithdrawQuote(
    inputs: InputTokenAmount[],
    option: StandardVaultWithdrawOption
  ): Promise<StandardVaultWithdrawQuote> {
    onlyInputCount(inputs, 1);

    const input = first(inputs);
    if (input.amount.lte(BIG_ZERO)) {
      throw new Error('Quote called with 0 input amount');
    }

    if (!isTokenEqual(input.token, this.depositToken)) {
      throw new Error('Quote called with invalid input token');
    }

    const state = this.getState();
    const { withdrawnAmountAfterFeeWei } = getVaultWithdrawnFromState(input, this.vault, state);
    const outputs = [
      {
        token: input.token,
        amount: fromWei(withdrawnAmountAfterFeeWei, input.token.decimals),
      },
    ];
    const allowances = [];

    return {
      id: createQuoteId(option.id),
      strategyId: option.strategyId,
      vaultType: option.vaultType,
      option,
      inputs,
      outputs,
      returned: [],
      allowances,
      priceImpact: 0,
    };
  }

  async fetchWithdrawStep(quote: TransactQuote, t: TFunction<Namespace>): Promise<Step> {
    onlyInputCount(quote.inputs, 1);

    const input = first(quote.inputs);

    return {
      step: 'withdraw',
      message: t('Vault-TxnConfirm', { type: t('Withdraw-noun') }),
      action: walletActions.withdraw(this.vault, input.amount, input.max),
      pending: false,
      extraInfo: { zap: false, vaultId: quote.option.vaultId },
    };
  }

  async fetchZapWithdraw(request: VaultWithdrawRequest): Promise<VaultWithdrawResponse> {
    onlyInputCount(request.inputs, 1);

    const input = first(request.inputs);
    if (!isTokenEqual(input.token, this.depositToken)) {
      throw new Error('Input token is not the deposit token');
    }

    const state = this.getState();
    const chain = selectChainById(state, this.vault.chainId);
    const web3 = await getWeb3Instance(chain);
    const multicall = new MultiCall(web3, chain.multicallAddress);
    const address = selectWalletAddress(state);
    const { sharesToWithdrawWei, withdrawnAmountAfterFeeWei } = await getVaultWithdrawnFromContract(
      { ...input, max: false },
      this.vault,
      state,
      address,
      web3,
      multicall
    );

    return {
      inputs: [
        {
          token: this.shareToken,
          amount: fromWei(sharesToWithdrawWei, this.shareToken.decimals),
        },
      ],
      outputs: [
        {
          token: this.depositToken,
          amount: fromWei(withdrawnAmountAfterFeeWei, this.depositToken.decimals),
        },
      ],
      zap: {
        target: this.vault.earnContractAddress,
        value: '0',
        data: abiCoder.encodeFunctionCall(
          {
            constant: false,
            inputs: [
              {
                internalType: 'uint256',
                name: '_shares',
                type: 'uint256',
              },
            ],
            name: 'withdraw',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
          [sharesToWithdrawWei.toString(10)]
        ),
        tokens: [
          {
            token: getTokenAddress(this.shareToken),
            index: getInsertIndex(0),
          },
        ],
      },
    };
  }
}
