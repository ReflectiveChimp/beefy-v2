import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    display: 'flex',
    flex: '1 1 auto',
    height: '100%',
    flexDirection: 'column',
    borderRadius: '8px',
  }),
  quotesHolder: css.raw({
    display: 'flex',
    flex: '1 1 auto',
    height: '100%',
    flexDirection: 'column',
    gap: '8px',
  }),
  quotesTitle: css.raw({
    textStyle: 'subline.sm',
    fontWeight: '700',
    color: 'text.dark',
  }),

  scrollableThumb: css.raw({
    background: 'extracted2916',
  }),
  scrollableTopShadow: css.raw({
    background: 'linear-gradient(0deg, extracted2615 0%, blacko49 100%)',
  }),
  scrollableBottomShadow: css.raw({
    background: 'linear-gradient(180deg, extracted2615 0%, blacko49 100%)',
  }),
  scrollableLeftShadow: css.raw({
    background: 'linear-gradient(270deg, extracted2615 0%, blacko49 100%)',
  }),
  scrollableRightShadow: css.raw({
    background: 'linear-gradient(90deg, extracted2615 0%, blacko49 100%)',
  }),
  quotes: css.raw({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: '8px',
    padding: '12px',
    borderRadius: '8px',
    background: 'background.content.light',
  }),
  quote: css.raw({
    textStyle: 'body.sm',
    color: 'text.dark',
    border: 'none',
    background: 'bayOfMany',
    boxShadow: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: '0',
    padding: '8px 12px',
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    gap: '8px',
  }),
  quoteButton: css.raw({
    cursor: 'pointer',
    '&:hover, &:focus-visible': {
      color: 'white',
    },
  }),
  quoteLimited: css.raw({
    pointerEvents: 'none',
    filter: 'grayscale(100)',
  }),
  quoteProvider: css.raw({
    textStyle: 'body.med',
    color: 'text.middle',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flex: '0 0 114px',
    mdDown: {
      flex: '0 0 24px',
    },
  }),
  quoteProviderIcon: css.raw({
    display: 'block',
  }),
  quoteProviderTitle: css.raw({
    display: 'block',
    mdDown: {
      display: 'none',
    },
  }),
  quoteLimit: css.raw({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: '1 0 142px',
  }),
  quoteLimitIcon: css.raw({
    width: '16px',
    height: '16px',
    fill: 'text.light',
  }),
  quoteFee: css.raw({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: '0 0 142px',
  }),
  quoteFeeIcon: css.raw({
    width: '16px',
    height: '16px',
    fill: 'text.light',
  }),
  quoteTime: css.raw({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: '0 0 50px',
  }),
  quoteTimeIcon: css.raw({
    width: '16px',
    height: '16px',
    fill: 'text.light',
  }),
  quoteButtonSelected: css.raw({
    background: 'background.content',
    color: 'text.light',
    cursor: 'default',
    pointerEvents: 'none',
    '&:hover, &:focus-visible': {
      background: 'extracted263',
    },
  }),
};
