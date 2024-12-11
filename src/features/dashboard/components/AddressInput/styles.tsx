import { css } from '@repo/styles/css';

export const styles = {
  search: css.raw({
    color: 'text.middle',
    background: 'purpleDarkest',
    borderRadius: '8px',
    '& .BaseInput-input': {
      width: '200px',
      maxWidth: '100%',
      transition: '0.2s ease-in-out',
      _focus: {
        width: '400px',
      },
      '&::placeholder': {
        color: 'text.dark',
        opacity: '1',
      },
    },
  }),
  active: css.raw({
    '& .BaseInput-input': {
      width: '400px',
    },
  }),
  icon: css.raw({
    background: 'transparent',
    padding: '0',
    border: '0',
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
