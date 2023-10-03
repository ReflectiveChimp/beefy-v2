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
import { selectSupportedSwapTokensForChainAggregatorHavingPrice } from '../../../../selectors/tokens';
import { getOneInchApi } from '../../../instances';
import { selectChainById } from '../../../../selectors/chains';
import { fromWeiString, toWeiString } from '../../../../../../helpers/big-number';
import { EEEE_ADDRESS } from '../../../../../../helpers/addresses';
import { selectSwapAggregatorForChainType } from '../../../../selectors/zap';
import type { OneInchSwapConfig } from '../../../config-types';
import type { VaultEntity } from '../../../../entities/vault';
import { ISwapAggregator } from '../ISwapAggregator';
import { getTokenAddress } from '../../helpers/zap';
import type { ZapAggregatorSwapRequest, ZapAggregatorSwapResponse } from '../../zap/swap';
import { slipBy } from '../../helpers/amounts';

export class OneInchSwapProvider implements ISwapProvider {
  getId(): string {
    return 'one-inch';
  }

  protected getTokenAddress(token: TokenEntity): string {
    return isTokenNative(token) ? EEEE_ADDRESS : token.address;
  }

  protected getConfigForChain(chainId: ChainEntity['id'], state: BeefyState): OneInchSwapConfig {
    const config = selectSwapAggregatorForChainType<OneInchSwapConfig>(state, chainId, 'one-inch');
    if (!config) {
      throw new Error(`No one-inch aggregator config found for chain ${chainId}`);
    }
    return config;
  }

  async fetchQuote(request: QuoteRequest, state: BeefyState): Promise<QuoteResponse> {
    const chain = selectChainById(state, request.fromToken.chainId);
    const config = this.getConfigForChain(chain.id, state);
    const api = await getOneInchApi(chain);
    const quote = await api.getQuote({
      fromTokenAddress: this.getTokenAddress(request.fromToken),
      toTokenAddress: this.getTokenAddress(request.toToken),
      amount: toWeiString(request.fromAmount, request.fromToken.decimals),
      fee: config.fee.value.toString(10),
    });

    return {
      providerId: this.getId(),
      fromToken: request.fromToken,
      fromAmount: request.fromAmount,
      toToken: request.toToken,
      toAmount: fromWeiString(quote.toTokenAmount, request.toToken.decimals),
      fee: config.fee,
    };
  }

  async fetchSwap(request: SwapRequest, state: BeefyState): Promise<SwapResponse> {
    const chain = selectChainById(state, request.fromToken.chainId);
    const config = this.getConfigForChain(chain.id, state);
    const api = await getOneInchApi(chain);
    const swap = await api.getSwap({
      fromAddress: request.fromAddress,
      fromTokenAddress: this.getTokenAddress(request.fromToken),
      toTokenAddress: this.getTokenAddress(request.toToken),
      amount: toWeiString(request.fromAmount, request.fromToken.decimals),
      slippage: request.slippage,
      disableEstimate: true,
      fee: config.fee.value.toString(10),
      referrerAddress: config.fee.recipient,
    });

    return {
      providerId: this.getId(),
      fromToken: request.fromToken,
      fromAmount: request.fromAmount,
      toToken: request.toToken,
      toAmount: fromWeiString(swap.toTokenAmount, request.toToken.decimals),
      toAmountMin: slipBy(
        fromWeiString(swap.toTokenAmount, request.toToken.decimals),
        request.slippage,
        request.toToken.decimals
      ),
      tx: {
        fromAddress: swap.tx.from,
        toAddress: swap.tx.to,
        data: swap.tx.data,
        value: swap.tx.value,
        inputPosition: -1, // not supported
      },
      fee: config.fee,
    };
  }

  async getSupportedTokens(
    vaultId: VaultEntity['id'],
    chainId: ChainEntity['id'],
    state: BeefyState
  ): Promise<TokenEntity[]> {
    const config = this.getConfigForChain(chainId, state);
    if (config.blockedVaults.includes(vaultId)) {
      return [];
    }

    const possibleTokens = selectSupportedSwapTokensForChainAggregatorHavingPrice(
      state,
      chainId,
      'one-inch'
    );
    return config.blockedTokens.length
      ? possibleTokens.filter(token => !config.blockedTokens.includes(token.id))
      : possibleTokens;
  }
}
