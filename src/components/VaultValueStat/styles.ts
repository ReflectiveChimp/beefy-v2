import { css } from '@repo/styles/css';

export const styles = {
  value: css.raw({
    textStyle: 'body.med',
    color: 'text.middle',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '100%',
  }),
  subValue: css.raw({
    textStyle: 'body.sm',
    color: 'text.dark',
  }),
  blurValue: css.raw({
    filter: 'blur(.5rem)',
  }),
  boostedValue: css.raw({
    color: 'background.vaults.boost',
  }),
  lineThroughValue: css.raw({
    textDecoration: 'line-through',
  }),
};
