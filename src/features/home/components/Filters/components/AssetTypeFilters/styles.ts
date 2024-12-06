import { css } from '@repo/styles/css';

export const styles = {
  holder: css.raw({
    position: 'relative',
    display: 'inline-block',
    padding: '0 8px 0 0',
  }),
  highlight: css.raw({
    textStyle: 'body.sm',
    backgroundColor: 'tags.clm.background',
    color: 'text.light',
    padding: '0px 6px',
    borderRadius: '10px',
    height: '20px',
    position: 'absolute',
    top: '-2px',
    right: '0',
    transform: 'translate(50%, -50%)',
    pointerEvents: 'none',
    zIndex: 'highlight',
  }),
};
