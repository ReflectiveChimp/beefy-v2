import { css } from '@repo/styles/css';

export const styles = {
  tabs: css.raw({
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    width: '100%',
    background: 'background.content.dark',
  }),
  tab: css.raw({
    textStyle: 'body.med',
    position: 'relative',
    color: 'text.dark',
    background: 'transparent',
    flexBasis: '1px',
    flexGrow: '1',
    flexShrink: '0',
    padding: '16px 0',
    margin: '0',
    border: 'none',
    boxShadow: 'none',
    outline: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '0',
      bottom: '0',
      right: '0',
      height: '2px',
      background: 'bayOfMany',
    },
    '&:first-child': {
      borderRadius: '12px 0 0 0',
    },
    '&:last-child': {
      borderRadius: '0 12px 0 0',
    },
  }),
  selectedTab: css.raw({
    color: 'text.light',
    cursor: 'default',
    pointerEvents: 'none',
    '&::before': {
      backgroundColor: 'text.dark',
    },
  }),
  highlightTab: css.raw({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: 'indicators.error',
      padding: '0',
      borderRadius: '100%',
      height: '8px',
      width: '8px',
      pointerEvents: 'none',
    },
  }),
};
