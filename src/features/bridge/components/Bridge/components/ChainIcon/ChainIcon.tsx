import { memo } from 'react';
import { getNetworkSrc } from '../../../../../../helpers/networkSrc';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { css, type CssStyles } from '@repo/styles/css';

export type ChainIconProps = {
  chainId: ChainEntity['id'];

  css?: CssStyles;
};
export const ChainIcon = memo(function ChainIcon({ chainId, css: cssProp }: ChainIconProps) {
  const src = getNetworkSrc(chainId);

  return src ? (
    <img src={src} width={24} height={24} alt={chainId} className={css(cssProp)} />
  ) : null;
});
