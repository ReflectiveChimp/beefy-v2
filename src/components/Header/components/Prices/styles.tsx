import { css } from '@repo/styles/css';

export const styles = {
  holder: css.raw({
    textStyle: 'body.med',
    lineHeight: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  }),
  navToken: css.raw({
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    color: 'text.light',
    lgDown: {
      justifyContent: 'flex-start',
    },
  }),
  navIcon: css.raw({
    display: 'block',
    height: '24px',
    width: '24px',
  }),
  trigger: css.raw({
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
    width: '68px',
    height: '24px',
  }),
  face: css.raw({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(0deg)',
    transition: 'transform 0.5s ease-in-out',
  }),
  current: css.raw({
    transform: 'rotateX(0deg)',
    zIndex: 2,
  }),
  next: css.raw({
    transform: 'rotateX(90deg)',
    zIndex: 1,
  }),
  hidden: css.raw({
    transform: 'rotateX(90deg)',
  }),
  icon: css.raw({
    display: 'block',
    height: '24px',
    width: '24px',
    gridColumnStart: '1',
  }),
  grid: css.raw({}),
  tooltipTokens: css.raw({
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'min-content 1fr min-content min-content min-content min-content',
    alignItems: 'center',
  }),
  tooltipToken: css.raw({}),
  mooToken: css.raw({
    textStyle: 'subline',
    textTransform: 'none',
    marginTop: '12px',
    textAlign: 'center',
    lineHeight: '1.1',
  }),
  symbol: css.raw({
    textStyle: 'body.med',
    paddingRight: '8px',
  }),
  price: css.raw({}),
  iconLink: css.raw({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    border: 'none',
    color: 'text.light',
    textDecoration: 'none',
    backgroundColor: 'bayOfMany',
    boxShadow: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
  }),
  iconLinkIcon: css.raw({
    height: '20px',
    width: '20px',
    fill: 'currentColor',
  }),
};
