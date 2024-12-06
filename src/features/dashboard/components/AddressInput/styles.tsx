import { css } from '@repo/styles/css';

export const styles = {
  search: css.raw({
    color: 'text.middle',
    background: 'purpleDarkest',
    borderRadius: '8px',
    //FIXME MUI2PANDA: Target MUI class
    '&.Mui-focused': {
      //FIXME MUI2PANDA: Target MUI class
      '& .MuiInputBase-input': {
        width: '400px',
        lgDown: {
          width: '100%',
        },
      },
    },
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiInputBase-input': {
      minWidth: '200px',
      transition: '0.2s ease-in-out',
      padding: '8px 16px',
      color: 'text.middle',
      height: 'auto',
      '&:focus': {
        color: 'text.light',
      },
      '&::placeholder': {
        color: 'text.dark',
        opacity: '1',
      },
    },
  }),
  active: css.raw({
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiInputBase-input': {
      width: '400px',
      mdDown: {
        width: '100%',
      },
    },
  }),
  icon: css.raw({
    background: 'transparent',
    padding: '0',
    border: '0',
    margin: '0 16px 0 0',
    boxShadow: 'none',
    lineHeight: 'inherit',
    display: 'flex',
    alignItems: 'center',
    flexShrink: '0',
    width: '24px',
    height: '24px',
    'button&': {
      cursor: 'pointer',
    },
  }),
  activeIcon: css.raw({
    color: 'text.light',
  }),
  disabledIcon: css.raw({
    color: 'text.dark',
  }),
  flex: css.raw({
    display: 'flex',
  }),
  loader: css.raw({
    margin: '0 16px 0 0',
  }),
};
