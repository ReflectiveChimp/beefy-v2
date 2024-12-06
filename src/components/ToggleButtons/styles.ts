import { css } from '@repo/styles/css';

export const styles = {
  buttons: css.raw({
    display: 'flex',
    width: 'fit-content',
    border: 'solid 2px {colors.background.content}',
    borderRadius: '8px',
    backgroundColor: 'background.content.dark',
  }),
  fullWidth: css.raw({
    width: '100%',
  }),
  button: css.raw({
    textStyle: 'body.med',
    color: 'text.dark',
    backgroundColor: 'inherit',
    border: 'none',
    borderRadius: '6px',
    boxShadow: 'none',
    cursor: 'pointer',
    margin: '0',
    padding: '6px 16px',
    flexGrow: '1',
    flexShrink: '0',
    position: 'relative',
    '&:hover': {
      color: 'text.middle',
      boxShadow: 'none',
    },
    '&:active, &:hover:active': {
      color: 'text.light',
    },
  }),
  selected: css.raw({
    pointerEvents: 'none',
    color: 'text.light',
    backgroundColor: 'bayOfMany',
    '&:hover': {
      color: 'text.light',
      backgroundColor: 'bayOfMany',
    },
  }),
  untogglable: css.raw({
    padding: '6px 2px',
  }),
  untogglableButton: css.raw({
    padding: '0 12px',
    '&:hover': {
      color: 'text.middle',
      backgroundColor: 'transparent',
    },
    '&:active, &:hover:active': {
      color: 'text.light',
      backgroundColor: 'transparent',
    },
    '&[data-selected=true]': {
      pointerEvents: 'all',
      color: 'text.light',
      backgroundColor: 'transparent',
      '&:hover': {
        color: 'text.light',
        backgroundColor: 'transparent',
      },
    },
  }),
  dropdown: css.raw({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
    padding: '12px',
    backgroundColor: 'background.content.light',
    borderRadius: '8px',
    marginTop: '8px',
    marginLeft: '4px',
  }),
  container: css.raw({
    display: 'flex',
    alignItems: 'center',
    textStyle: 'body.med',
    color: 'text.dark',
    fill: 'text.dark',
    '&:hover': {
      color: 'text.light',
      fill: 'text.light',
      cursor: 'pointer',
    },
  }),
  icon: css.raw({
    height: '20px',
  }),
  iconActive: css.raw({
    fill: 'text.light',
  }),
  buttonList: css.raw({
    textStyle: 'body.med',
    color: 'text.dark',
    backgroundColor: 'inherit',
    border: 'none',
    padding: '0',
    textAlign: 'start',
    '&:hover': {
      color: 'text.light',
      cursor: 'pointer',
    },
  }),
  selectedList: css.raw({
    color: 'text.light',
  }),
};
