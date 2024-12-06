import { css } from '@repo/styles/css';

export const styles = {
  sortColumns: css.raw({
    display: 'grid',
    width: '100%',
    columnGap: '24px',
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
  }),
  sortDropdown: css.raw({
    backgroundColor: 'purpleDarkest',
    md: {
      width: '200px',
      maxWidth: '100%',
      marginLeft: 'auto',
    },
  }),
};
