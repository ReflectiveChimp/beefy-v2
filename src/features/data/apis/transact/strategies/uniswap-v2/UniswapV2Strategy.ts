import type { UniswapV2StrategyOptions } from '../IStrategy';
import type { AmmEntity, AmmEntityUniswapV2 } from '../../../../entities/amm';
import { UniswapLikeStrategy } from '../UniswapLikeStrategy';

export class UniswapV2Strategy extends UniswapLikeStrategy<
  AmmEntityUniswapV2,
  UniswapV2StrategyOptions
> {
  public readonly id = 'uniswap-v2';

  protected isAmmType(amm: AmmEntity): amm is AmmEntityUniswapV2 {
    return amm.type === 'uniswap-v2';
  }
}
