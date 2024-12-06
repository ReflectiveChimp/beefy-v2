import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    display: 'grid',
    rowGap: '16px',
    columnGap: '16px',
    gridTemplateColumns: 'repeat(6,minmax(0,1fr))',
    lgDown: {
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
    },
    mdDown: {
      gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    },
  }),
  chain: css.raw({
    display: 'flex',
    padding: '12px',
    columnGap: '8px',
    backgroundColor: 'background.content',
    borderRadius: '4px',
    alignItems: 'center',
  }),
  chainLogo: css.raw({
    height: '32px',
  }),
  chainText: css.raw({
    textStyle: 'subline.sm',
    color: 'text.dark',
  }),
  chainValue: css.raw({
    textStyle: 'body.med',
    color: 'text.middle',
  }),
};
