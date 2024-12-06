import { css } from '@repo/styles/css';

export const styles = {
  shortAddress: css.raw({
    textStyle: 'h3',
    color: 'text.dark',
  }),
  longAddress: css.raw({
    smDown: {
      textStyle: 'body.sm',
    },
  }),
  triggerClass: css.raw({
    '&:hover': {
      cursor: 'pointer',
    },
  }),
  tooltipContent: css.raw({
    '&:hover': {
      cursor: 'pointer',
    },
    '@media (min-width: 0)': {
      maxWidth: 'min(100%, 450px)',
    },
  }),
};
