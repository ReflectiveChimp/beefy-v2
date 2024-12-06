import { css } from '@repo/styles/css';

export const styles = {
  searchableList: css.raw({
    display: 'grid',
    gridTemplateColumns: 'auto',
    gridTemplateRows: 'auto minmax(0,1fr)',
    flexDirection: 'column',
    width: 'calc(100% + 48px)',
    height: 'calc(100% + 24px)',
    margin: '0 -24px -24px -24px',
    rowGap: '24px',
  }),
  search: css.raw({
    padding: '0 24px',
  }),
  list: css.raw({
    padding: '0 24px 24px 24px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '16px',
    overflowY: 'auto',
  }),
};

export const itemStyles = {
  item: {
    textStyle: 'body.med',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: 'text.dark',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: '0',
    margin: '0',
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    '&:hover, &:focus-visible': {
      color: 'text.middle',
      '& .item-arrow': {
        color: 'white',
      },
    },
  },
  arrow: {
    color: 'text.middle',
    height: '24px',
  },
  marginWithendAdornment: {
    marginRight: '8px',
  },
  endAdornment: {
    marginLeft: 'auto',
    display: 'flex',
  },
} as const;
