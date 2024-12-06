import { css } from '@repo/styles/css';

export const styles = {
  filters: css.raw({
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '16px',
    columnGap: '16px',
  }),
  userCategory: css.raw({
    width: '100%',
    lg: {
      width: 'fit-content',
      marginRight: 'auto',
    },
  }),
  chain: css.raw({
    width: '100%',
    md: {
      width: 'fit-content',
      flexBasis: '25%',
      flexShrink: '1',
      flexGrow: '1',
    },
    lg: {
      width: '100%',
      flexBasis: '100%',
      flexShrink: '0',
    },
  }),
  assetType: css.raw({
    width: '100%',
    md: {
      width: 'fit-content',
      flexBasis: '25%',
      flexShrink: '1',
      flexGrow: '1',
    },
    lg: {
      flexBasis: 'auto',
      flexShrink: '0',
      flexGrow: '0',
    },
  }),
  vaultCategory: css.raw({}),
  platforms: css.raw({}),
  extended: css.raw({}),
  clear: css.raw({}),
  button: css.raw({
    width: 'auto',
    flexBasis: 'calc(50% - 8px)',
    flexShrink: '0',
    flexGrow: '1',
    md: {
      flexBasis: 'auto',
      flexGrow: '0',
      flexShrink: '0',
    },
    '&:disabled': {
      backgroundColor: 'background.content.dark',
      opacity: '0.4',
    },
  }),
};
