import { css } from '@repo/styles/css';

export const styles = {
  input: css.raw({
    color: 'text.middle',
    background: 'purpleDarkest',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    cursor: 'default',
    //FIXME MUI2PANDA: Target MUI class
    '& .MuiInputBase-input': {
      textStyle: 'h2',
      padding: '8px 16px',
      color: 'text.middle',
      height: 'auto',
      cursor: 'default',
      '&:focus': {
        color: 'text.light',
      },
      '&::placeholder': {
        color: 'text.dark',
        opacity: '1',
      },
    },
  }),
  pending: css.raw({
    position: 'absolute',
    left: '0',
    top: '0',
    padding: '8px 16px',
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
