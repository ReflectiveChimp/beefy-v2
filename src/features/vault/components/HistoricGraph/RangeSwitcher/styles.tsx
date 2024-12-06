import { css } from '@repo/styles/css';

export const styles = {
  tabs: css.raw({
    border: '0',
    padding: '0',
    background: 'transparent',
    gap: '12px',
  }),
  tab: css.raw({
    textStyle: 'body.sm.med',
    border: '0',
    padding: '0',
    background: 'transparent',
    '&:hover': {
      background: 'transparent',
    },
  }),
  selected: css.raw({
    background: 'transparent',
  }),
};
