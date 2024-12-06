import { css } from '@repo/styles/css';

export const styles = {
  customDivider: css.raw({
    display: 'flex',
    alignItems: 'center',
    margin: '16pxpx 0px',
  }),
  line: css.raw({
    height: '2px',
    width: '100%',
    backgroundColor: 'background.vaults.standard',
    borderRadius: '8px',
  }),
  arrowContainer: css.raw({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'background.content.light',
    borderRadius: '100%',
    margin: '0 12px',
    height: '24px',
    width: '24px',
    padding: '8px',
  }),
  arrowSvg: css.raw({
    color: 'text.middle',
    fill: 'currentColor',
    fontSize: '1.5rem',
    width: '1em',
    height: '1em',
    '&[data-clickable]:hover': {
      cursor: 'pointer',
      color: 'text.light',
    },
  }),
};
