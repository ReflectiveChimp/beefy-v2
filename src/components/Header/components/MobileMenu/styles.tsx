import { css } from '@repo/styles/css';

export const styles = {
  bg: css.raw({
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiDrawer-paper': {
      backgroundColor: 'background.header',
    },
  }),
  toggleDrawer: css.raw({
    background: 'transparent',
    padding: '3px',
    border: '0',
    boxShadow: 'none',
    color: 'text.light',
    fontSize: '30px',
    position: 'relative',
  }),
  toggleDrawerIcon: css.raw({
    display: 'block',
  }),
  toggleDrawNotification: css.raw({
    position: 'absolute',
    top: '8px',
    right: '8px',
  }),
  menuContainer: css.raw({
    height: '100%',
    xlDown: {
      width: '320px',
    },
  }),
  head: css.raw({
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  flex: css.raw({
    display: 'flex',
    columnGap: '24px',
  }),
  divider: css.raw({
    backgroundColor: 'background.content.dark',
    height: '2px',
  }),
  itemTitle: css.raw({
    display: 'flex',
    columnGap: '8px',
    color: 'text.dark',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiBadge-root': {
      padding: '0px 12px 0px 0px',
      verticalAlign: 'initial',
      columnGap: '8px',
    },
  }),
  title: css.raw({}),
  titleWithBadge: css.raw({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  }),
  itemsContainer: css.raw({
    padding: '16px 0px 16px 16px',
  }),
  customPadding: css.raw({
    padding: '16px 16px 16px 32px',
  }),
  cross: css.raw({
    color: 'text.middle',
    '&:hover': {
      color: 'text.light',
      cursor: 'pointer',
    },
  }),
};
