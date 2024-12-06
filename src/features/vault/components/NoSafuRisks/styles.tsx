import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    textStyle: 'body',
    color: 'text.white',
    background: 'indicators.warning',
    padding: '16px',
    borderRadius: '8px',
  }),
  link: css.raw({
    color: 'text.white',
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  }),
};
