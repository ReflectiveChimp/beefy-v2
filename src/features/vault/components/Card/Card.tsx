import type { PropsWithChildren } from 'react';
import { memo } from 'react';
import { Paper } from '@material-ui/core';
import { css, type CssStyles } from '@repo/styles/css';
import { styles } from './styles';

export type CardProps = PropsWithChildren<{
  css?: CssStyles;
  id?: string;
}>;
export const Card = memo(function Card({ css: cssProp, children, id }: CardProps) {
  return (
    <Paper id={id} className={css(styles.container, cssProp)}>
      {children}
    </Paper>
  );
});
