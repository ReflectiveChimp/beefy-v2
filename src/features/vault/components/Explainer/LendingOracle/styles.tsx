import { css } from '@repo/styles/css';

export const styles = {
  apyTitle: css.raw({
    textStyle: 'h3',
    color: 'text.middle',
    marginBottom: '8px',
  }),
  apys: css.raw({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px 32px',
  }),
  apy: css.raw({}),
  apyLabel: css.raw({
    textStyle: 'subline.sm',
    color: 'text.dark',
  }),
  apyValue: css.raw({
    textStyle: 'body.med',
    color: 'text.middle',
  }),
  oracleLink: css.raw({
    textStyle: 'body.med',
    color: 'text.middle',
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
  }),
};
