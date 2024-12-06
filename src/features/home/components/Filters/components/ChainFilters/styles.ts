import { css } from '@repo/styles/css';

export const styles = {
  selector: css.raw({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    columnGap: '0',
    rowGap: '16px',
    width: 'fit-content',
    border: 'solid 2px {colors.background.content}',
    borderRadius: '8px',
    backgroundColor: 'background.content.dark',
  }),
  icon: css.raw({
    width: '24px',
    height: '24px',
    display: 'block',
    margin: '0 auto',
  }),
  button: css.raw({
    position: 'relative',
    background: 'transparent',
    boxShadow: 'none',
    flexGrow: '1',
    flexShrink: '0',
    padding: '6px 0px',
    border: '0',
    borderRadius: '6px',
    cursor: 'pointer',
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: '-1px',
      margin: '-10px 0 0 0',
      height: '20px',
      width: '1px',
      backgroundColor: 'bayOfMany',
    },
    '&:first-child::before': {
      display: 'none',
    },
  }),
  selected: css.raw({
    backgroundColor: 'background.content.dark',
  }),
  unselectedIcon: css.raw({
    '& .bg': {
      fill: 'extracted790',
    },
    '& .fg': {
      fill: 'background.body',
    },
  }),
  tooltip: css.raw({
    textStyle: 'body.med',
    background: 'background.content.light',
    padding: '8px 12px',
    borderRadius: '4px',
    color: 'text.dark',
    margin: '4px 0',
  }),
  iconWithChain: css.raw({
    display: 'flex',
    alignItems: 'center',
  }),
  iconWithChainIcon: css.raw({
    marginRight: '4px',
  }),
  iconWithChainSelected: css.raw({
    '& > img': {
      marginRight: '4px',
    },
  }),
  badge: css.raw({
    top: 'auto',
    right: 'auto',
    marginTop: '-12px',
    marginLeft: '4px',
  }),
  badgeMobile: css.raw({
    position: 'static',
    transform: 'none',
    top: '0',
    right: '0',
    marginLeft: '8px',
  }),
};
