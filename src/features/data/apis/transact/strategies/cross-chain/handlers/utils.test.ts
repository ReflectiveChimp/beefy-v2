import { describe, expect, it } from 'vitest';
import { ZERO_ADDRESS } from '../../../../../../../helpers/addresses.ts';
import { selectSharedBalanceWrappedToken } from '../../../../../selectors/tokens.ts';
import {
  ARC_USDC_ADDRESS,
  arcUsdc,
  baseUsdc,
  baseWeth,
  makeState,
} from '../../../helpers/same-balance.test-helper.ts';
import type { ZapStep } from '../../../zap/types.ts';
import { withoutBridgeTokenBalanceInsertion } from './utils.ts';

const state = makeState();
const arcShared = selectSharedBalanceWrappedToken(state, 'arc');
const baseShared = selectSharedBalanceWrappedToken(state, 'base');

const LP = '0x1111111111111111111111111111111111111111';

function step(tokens: ZapStep['tokens']): ZapStep {
  return { target: LP, value: '0', data: '0x', tokens };
}

describe('withoutBridgeTokenBalanceInsertion', () => {
  it('spends the encoded amount of the token in every step that lists it', () => {
    const steps = [
      step([{ token: baseUsdc.address, index: -1 }]),
      step([
        { token: baseUsdc.address.toLowerCase(), index: 4 },
        { token: baseWeth.address, index: 36 },
      ]),
      step([{ token: LP, index: 4 }]),
    ];

    expect(
      withoutBridgeTokenBalanceInsertion(steps, baseUsdc, baseShared).map(s => s.tokens)
    ).toEqual([
      [{ token: baseUsdc.address, index: -1 }],
      [
        { token: baseUsdc.address.toLowerCase(), index: -1 },
        { token: baseWeth.address, index: 36 },
      ],
      [{ token: LP, index: 4 }],
    ]);
  });

  it('drops the native entry when native is the same balance as the token', () => {
    const steps = [
      step([
        { token: ZERO_ADDRESS, index: -1 },
        { token: ARC_USDC_ADDRESS, index: 4 },
      ]),
    ];

    expect(withoutBridgeTokenBalanceInsertion(steps, arcUsdc, arcShared)[0].tokens).toEqual([
      { token: ARC_USDC_ADDRESS, index: -1 },
    ]);
  });

  it('keeps the native entry when native is a separate balance', () => {
    const steps = [step([{ token: ZERO_ADDRESS, index: -1 }])];

    expect(withoutBridgeTokenBalanceInsertion(steps, baseUsdc, baseShared)[0].tokens).toEqual([
      { token: ZERO_ADDRESS, index: -1 },
    ]);
  });
});
