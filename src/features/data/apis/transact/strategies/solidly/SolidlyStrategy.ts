import type { SolidlyStrategyOptions } from '../IStrategy';
import type { AmmEntity, AmmEntitySolidly } from '../../../../entities/amm';
import { UniswapLikeStrategy } from '../UniswapLikeStrategy';

export class SolidlyStrategy extends UniswapLikeStrategy<AmmEntitySolidly, SolidlyStrategyOptions> {
  public readonly id = 'solidly';

  protected isAmmType(amm: AmmEntity): amm is AmmEntitySolidly {
    return amm.type === 'solidly';
  }
}
