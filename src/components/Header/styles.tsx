import { css } from '@repo/styles/css';

export const styles = {
  headerContainer: css.raw({
    flexGrow: '1',
  }),
  navHeader: css.raw({
    background: 'transparent',
    boxShadow: 'none',
    //FIXME MUI2PANDA: Target MUI class
    '&:hover .MuiListItem-button': {
      background: 'transparent',
    },
  }),
  flex: css.raw({
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    columnGap: '16px',
  }),
  hasPortfolio: css.raw({
    backgroundColor: 'background.header',
  }),
  container: css.raw({
    paddingTop: '12px',
    paddingBottom: '12px',
  }),
  content: css.raw({
    justifyContent: 'space-between',
  }),
  beefy: css.raw({
    display: 'block',
    '& img': {
      height: '40px',
      display: 'block',
    },
  }),
};
