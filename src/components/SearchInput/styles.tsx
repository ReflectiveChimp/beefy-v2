import { css } from '@repo/styles/css';

export const styles = {
  icon: css.raw({
    background: 'transparent',
    padding: '0',
    border: '0',
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
