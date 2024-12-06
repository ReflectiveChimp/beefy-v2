import { css } from '@repo/styles/css';

export const styles = {
  portfolio: css.raw({
    backgroundColor: 'background.header',
    padding: '16px 0 40px 0',
  }),
  stats: css.raw({
    display: 'grid',
    gridTemplateColumns: '100%',
    rowGap: '32px',
    columnGap: '32px',
    md: {
      gridTemplateColumns: '583fr 417fr',
    },
  }),
  userStats: css.raw({}),
  vaultStats: css.raw({
    md: {
      textAlign: 'right',
    },
  }),
  title: css.raw({
    textStyle: 'h3',
    color: 'text.middle',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  }),
  vaultStatsTitle: css.raw({
    md: {
      justifyContent: 'flex-end',
    },
  }),
  btnHide: css.raw({
    color: 'extracted2048',
    marginLeft: '8px',
    padding: '0',
    minWidth: '0',
    width: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'extracted1071',
    },
  }),
};
