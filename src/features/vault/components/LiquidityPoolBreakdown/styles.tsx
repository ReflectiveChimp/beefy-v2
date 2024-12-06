import { css } from '@repo/styles/css';

export const styles = {
  header: css.raw({
    sm: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    smDown: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '16px',
    },
  }),
  tabs: css.raw({
    marginTop: '16px',
    backgroundColor: 'transparent',
    sm: {
      marginTop: '0',
    },
  }),
  layout: css.raw({
    backgroundColor: 'background.content',
    borderRadius: '0 0 12px 12px',
    lg: {
      display: 'grid',
      gridTemplateColumns: '232fr 484fr',
    },
  }),
};
