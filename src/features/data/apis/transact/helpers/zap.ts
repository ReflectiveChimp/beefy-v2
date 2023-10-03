import { ZERO_ADDRESS } from '../../../../../helpers/addresses';
import type { TokenEntity } from '../../../entities/token';
import type { OrderRelay } from '../zap/types';

export const NO_RELAY: OrderRelay = { target: ZERO_ADDRESS, value: '0', data: '0x' };

export function getTokenAddress(token: TokenEntity): string {
  if (token.address === 'native') {
    return ZERO_ADDRESS;
  }

  return token.address;
}

export function getInsertIndex(position: number): number {
  return 4 + position * 32;
}
