import { css } from '@repo/styles/css';

export const styles = {
  navLink: css.raw({
    display: 'flex',
    textStyle: 'body.med',
    textDecoration: 'none',
    color: 'text.dark',
    columnGap: '8px',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiBadge-root': {
      padding: '0px 12px 0px 0px',
      verticalAlign: 'initial',
      columnGap: '8px',
    },
    '&:hover': {
      color: 'text.light',
      cursor: 'pointer',
    },
    '& a': {
      textDecoration: 'none',
      color: 'text.dark',
      '&:hover': {
        color: 'text.light',
        '& svg': {
          color: 'text.light',
        },
      },
    },
  }),
  active: css.raw({
    color: 'text.light',
    '& svg ': {
      color: 'text.light',
    },
  }),
  itemMobile: css.raw({
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  flex: css.raw({
    display: 'flex',
    columnGap: '8px',
  }),
  arrow: css.raw({
    height: '12px',
  }),
  title: css.raw({}),
  titleWithBadge: css.raw({
    position: 'relative',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
  }),
  badge: css.raw({}),
};
