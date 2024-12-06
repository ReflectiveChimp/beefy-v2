import { css } from '@repo/styles/css';

export const styles = {
  label: css.raw({
    textStyle: 'body.med',
    display: 'flex',
    alignItems: 'center',
    columnGap: '4px',
    color: 'text.dark',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiBadge-root': {
      padding: '0px 12px 0px 0px',
      verticalAlign: 'initial',
      columnGap: '4px',
    },
    '&:hover': {
      cursor: 'pointer',
      color: 'text.light',
    },
  }),
  active: css.raw({
    color: 'text.light',
  }),
  arrow: css.raw({
    height: '18px',
    width: '18px',
  }),
  activeArrow: css.raw({
    transform: 'rotateX(180deg)',
  }),
  dropdown: css.raw({
    zIndex: 'dropdown',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '12px',
    padding: '8px',
    border: '2px solid {colors.background.content.dark}',
    backgroundColor: 'purpleDarkest',
    borderRadius: '4px',
    marginLeft: '-8px',
  }),
  title: css.raw({}),
  titleWithBadge: css.raw({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  }),
};
