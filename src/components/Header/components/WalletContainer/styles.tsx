import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    padding: '8px 16px',
  }),
  address: css.raw({
    textStyle: 'body.med',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&:hover': {
      cursor: 'pointer',
    },
  }),
  disconnected: css.raw({
    display: 'flex',
    justifyContent: 'center',
    background: 'green',
    '& .wallet-address': {
      color: 'text.light',
      textOverflow: 'clip',
    },
  }),
  known: css.raw({
    border: '2px solid {colors.indicators.warning}',
    '& .wallet-address': {
      color: 'text.middle',
    },
    '&:hover': {
      borderColor: 'background.content.light',
    },
  }),
  connected: css.raw({
    borderColor: 'green',
    backgroundColor: 'background.content.dark',
  }),
  loading: css.raw({
    paddingTop: '4px',
  }),
  blurred: css.raw({
    filter: 'blur(.5rem)',
  }),
};
