import type { BeefyState } from '../../../../../../redux-types';
import type { TokenEntity } from '../../../../entities/token';
import { isTokenEqual } from '../../../../entities/token';
import { selectSupportedSwapTokensForChainAggregatorHavingPrice } from '../../../../selectors/tokens';
import type { IStrategy, OptionRouteStepFrom, OptionRouteStepTo } from '../IStrategy';

export class OneInchSwapStrategy implements IStrategy {
  getId() {
    return 'one-inch';
  }

  async fetchRoutesTo(token: TokenEntity, state: BeefyState): Promise<OptionRouteStepTo[]> {
    const tokens = selectSupportedSwapTokensForChainAggregatorHavingPrice(
      state,
      token.chainId,
      'one-inch'
    );

    return tokens
      .filter(t => !isTokenEqual(t, token))
      .map(t => ({
        strategyId: this.getId(),
        from: [t],
        to: token,
      }));
  }

  async fetchRoutesFrom(token: TokenEntity, state: BeefyState): Promise<OptionRouteStepFrom[]> {
    const tokens = selectSupportedSwapTokensForChainAggregatorHavingPrice(
      state,
      token.chainId,
      'one-inch'
    );

    return tokens
      .filter(t => !isTokenEqual(t, token))
      .map(t => ({
        strategyId: this.getId(),
        from: token,
        to: [t],
      }));
  }
}
