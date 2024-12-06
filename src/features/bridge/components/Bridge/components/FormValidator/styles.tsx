import { css } from '@repo/styles/css';

export const styles = {
  group: css.raw({}),
  labels: css.raw({
    display: 'flex',
    marginBottom: '4px',
  }),
  label: css.raw({
    textStyle: 'subline.sm',
    fontWeight: '700',
    color: 'text.dark',
    flex: '1 1 40%',
  }),
  balance: css.raw({
    textStyle: 'body.sm',
    cursor: 'pointer',
    color: 'text.dark',
    '& span': {
      paddingLeft: '4px',
      fontWeight: 'body.medium',
      color: 'text.middle',
    },
  }),
  input: css.raw({}),
};
