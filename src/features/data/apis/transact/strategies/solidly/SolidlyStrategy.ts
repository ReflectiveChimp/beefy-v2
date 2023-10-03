import type { IStrategy } from '../IStrategy';

export class SolidlyStrategy implements IStrategy {
  getId() {
    return 'solidly';
  }
}
