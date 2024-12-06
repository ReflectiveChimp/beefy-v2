import { css } from '@repo/styles/css';

export const styles = {
  select: css.raw({
    textStyle: 'body.med',
    backgroundColor: 'background.content.dark',
    border: 'solid 2px {colors.background.content}',
    borderRadius: '8px',
    minWidth: '0',
    width: 'fit-content',
    color: 'text.middle',
    padding: '6px 14px',
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: 'none',
    textAlign: 'left',
    '&:hover': {
      boxShadow: 'none',
    },
  }),
  selectCurrent: css.raw({
    display: 'flex',
    alignItems: 'center',
    minWidth: '0',
  }),
  selectLabel: css.raw({
    flexShrink: '0',
    flexGrow: '0',
    color: 'text.dark',
    marginRight: '4px',
  }),
  selectValue: css.raw({
    flexShrink: '1',
    flexGrow: '0',
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: '4px',
  }),
  selectIcon: css.raw({
    flexShrink: '0',
    flexGrow: '0',
    marginLeft: 'auto',
    fill: 'currentColor',
  }),
  selectFullWidth: css.raw({
    width: '100%',
  }),
  selectBorderless: css.raw({
    borderWidth: '0',
    padding: '8px 16px',
  }),
  selectOpen: css.raw({
    color: 'text.light',
    '& svg': {
      color: 'text.light',
    },
  }),
  selectOpenIcon: css.raw({
    transform: 'rotateX(180deg)',
  }),
  selectDisabled: css.raw({
    pointerEvents: 'none',
  }),
  dropdown: css.raw({
    textStyle: 'body.med',
    zIndex: 'dropdown',
    border: '2px solid {colors.background.content.light}',
    borderRadius: '8px',
    backgroundColor: 'background.content',
    padding: '6px 0',
    color: 'text.middle',
    maxWidth: '100%',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    minHeight: '100px',
  }),
  dropdownItem: css.raw({
    userSelect: 'none',
    cursor: 'pointer',
    padding: '8px 14px',
    '&:hover': {
      background: 'whiteo15',
      color: 'text.light',
    },
    '&:active': {
      background: 'transparent',
      color: 'text.light',
    },
  }),
  dropdownItemSelected: css.raw({
    background: 'transparent',
    color: 'text.light',
  }),
};
