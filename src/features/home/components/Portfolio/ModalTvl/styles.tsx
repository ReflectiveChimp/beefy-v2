import { css } from '@repo/styles/css';

export const styles = {
  holder: css.raw({
    position: 'absolute',
    outline: 'none',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    smDown: {
      padding: '0',
    },
  }),
  card: css.raw({
    margin: '0',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '1272px',
    maxWidth: '100%',
  }),
  header: css.raw({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    borderRadius: '10px 10px 0px 0px ',
    borderBottom: '2px solid {colors.background.content.light}',
  }),
  title: css.raw({
    color: 'text.light',
  }),
  closeIcon: css.raw({
    '&:hover': {
      background: 'none',
    },
  }),
  content: css.raw({
    backgroundColor: 'background.content',
    borderRadius: '0 0 12px 12px',
    padding: '24px',
    minHeight: '200px',
    flexShrink: '1',
    display: 'flex',
    flexDirection: 'column',
  }),
  gridScroller: css.raw({
    flexShrink: '1',
    maxHeight: '100%',
    minHeight: '100px',
    overflowY: 'auto',
  }),
  grid: css.raw({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    sm: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    md: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    lg: {
      gridTemplateColumns: 'repeat(5, 1fr)',
    },
  }),
  closeButton: css.raw({
    marginTop: '32px',
  }),
  chain: css.raw({
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: 'background.content.light',
  }),
  chainText: css.raw({
    textStyle: 'subline.sm',
    color: 'text.dark',
  }),
  chainValue: css.raw({
    textStyle: 'body.med',
    color: 'text.middle',
  }),
  chainLogo: css.raw({
    height: '32px',
    width: '32px',
    marginRight: '8px',
  }),
};
