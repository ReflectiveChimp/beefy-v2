import { css } from '@repo/styles/css';

export const styles = {
  header: css.raw({
    display: 'grid',
    columnGap: '24px',
    rowGap: '16px',
    width: '100%',
    color: 'text.dark',
    background: 'background.content.dark',
    padding: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    backgroundClip: 'padding-box',
    sm: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    lg: {
      gridTemplateColumns: 'minmax(0, 40fr) minmax(0, 60fr)',
    },
  }),
  searchWidth: css.raw({
    lg: {
      maxWidth: '75%',
    },
  }),
};
