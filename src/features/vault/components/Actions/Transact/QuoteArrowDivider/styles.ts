import { css } from '@repo/styles/css';

export const styles = {
  holder: css.raw({
    display: 'flex',
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    '&::before, &::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 'calc(50% - 1px)',
      height: '2px',
      background: 'background.content.light',
      width: 'calc((100% - 48px)/2)',
    },
    '&::before': {
      left: '0',
    },
    '&::after': {
      right: '0',
    },
  }),
  arrow: css.raw({
    fill: 'background.content.light',
    width: '15px',
    height: '18px',
  }),
};
