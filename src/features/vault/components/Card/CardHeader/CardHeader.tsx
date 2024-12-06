import type { ReactNode } from 'react';
import { memo } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';

export type CardHeaderProps = {
  children: ReactNode;
  css?: CssStyles;
  disableDefaultClass?: boolean;
};
export const CardHeader = memo(function CardHeader({
  children,
  css: cssProp,
  disableDefaultClass = false,
}: CardHeaderProps) {
  return <div className={css(cssProp, !disableDefaultClass && styles.container)}>{children}</div>;
});
