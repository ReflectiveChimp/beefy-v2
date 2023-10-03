import type { BeefyState } from '../../../../../../redux-types';
import type {
  ISwapProvider,
  QuoteRequest,
  QuoteResponse,
  SwapRequest,
  SwapResponse,
} from '../ISwapProvider';
import type { ChainEntity } from '../../../../entities/chain';
import type { TokenEntity } from '../../../../entities/token';
import { isTokenNative } from '../../../../entities/token';
import {
  selectChainNativeToken,
  selectChainWrappedNativeToken,
} from '../../../../selectors/tokens';
import { toWeiString } from '../../../../../../helpers/big-number';
import type { VaultEntity } from '../../../../entities/vault';
import abiCoder from 'web3-eth-abi';
import { getInsertIndex } from '../../helpers/zap';
import { nativeAndWrappedAreSame } from '../../helpers/tokens';
import { ZERO_FEE } from '../../helpers/quotes';

export class WNativeSwapProvider implements ISwapProvider {
  getId(): string {
    return 'wnative';
  }

  async fetchQuote(request: QuoteRequest, state: BeefyState): Promise<QuoteResponse> {
    // 1:1
    return {
      providerId: this.getId(),
      fromToken: request.fromToken,
      fromAmount: request.fromAmount,
      toToken: request.toToken,
      toAmount: request.fromAmount,
      fee: ZERO_FEE,
    };
  }

  async fetchSwap(request: SwapRequest, state: BeefyState): Promise<SwapResponse> {
    const chainId = request.fromToken.chainId;
    const wnative = selectChainWrappedNativeToken(state, chainId);
    const inputIsNative = isTokenNative(request.fromToken);
    const fromAmountWei = toWeiString(request.fromAmount, request.fromToken.decimals);

    return {
      providerId: this.getId(),
      fromToken: request.fromToken,
      fromAmount: request.fromAmount,
      toToken: request.toToken,
      toAmount: request.fromAmount,
      toAmountMin: request.fromAmount, // no slippage
      tx: {
        fromAddress: request.fromAddress,
        toAddress: wnative.address,
        data: inputIsNative ? this.encodeWrapCall() : this.encodeUnwrapCall(fromAmountWei),
        value: inputIsNative ? fromAmountWei : '0',
        inputPosition: inputIsNative ? -1 : getInsertIndex(0),
      },
      fee: ZERO_FEE,
    };
  }

  async getSupportedTokens(
    vaultId: VaultEntity['id'],
    chainId: ChainEntity['id'],
    state: BeefyState
  ): Promise<TokenEntity[]> {
    if (nativeAndWrappedAreSame(chainId)) {
      return [];
    }

    const native = selectChainNativeToken(state, chainId);
    const wnative = selectChainWrappedNativeToken(state, chainId);
    return [native, wnative];
  }

  protected encodeWrapCall(): string {
    return abiCoder.encodeFunctionCall(
      {
        type: 'function',
        name: 'deposit',
        constant: false,
        stateMutability: 'payable',
        payable: true,
        inputs: [],
        outputs: [],
      },
      []
    );
  }

  protected encodeUnwrapCall(amountWei: string): string {
    return abiCoder.encodeFunctionCall(
      {
        type: 'function',
        name: 'withdraw',
        constant: false,
        payable: false,
        inputs: [{ type: 'uint256', name: 'wad' }],
        outputs: [],
      },
      [amountWei]
    );
  }
}
