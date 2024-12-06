import { memo, type ReactNode } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';

type CardContentProps = {
  children: ReactNode;
  css?: CssStyles;
  disableDefaultClass?: boolean;
};

export const CardContent = memo(function CardContent({
  children,
  css: cssProp,
  disableDefaultClass = false,
}: CardContentProps) {
  return <div className={css(cssProp, !disableDefaultClass && styles.container)}>{children}</div>;
});
