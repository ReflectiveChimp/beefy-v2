import { css } from '@repo/styles/css';

export const styles = {
  search: css.raw({
    color: 'text.middle',
    background: 'purpleDarkest',
    borderRadius: '8px',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiInputBase-input': {
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
  icon: css.raw({
    background: 'transparent',
    padding: '0',
    border: '0',
    margin: '0 16px 0 0',
    boxShadow: 'none',
    lineHeight: 'inherit',
    display: 'flex',
    alignItems: 'center',
    color: 'text.middle',
    flexShrink: '0',
    width: '24px',
    height: '24px',
    'button&': {
      cursor: 'pointer',
    },
  }),
};
