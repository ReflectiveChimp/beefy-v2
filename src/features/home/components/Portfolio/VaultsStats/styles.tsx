import { css } from '@repo/styles/css';

export const styles = {
  userStats: css.raw({
    display: 'flex',
    '& div:last-child': {
      marginRight: '0',
    },
    md: {
      justifyContent: 'flex-end',
    },
  }),
  stat: css.raw({
    paddingTop: '0',
    paddingBottom: '0',
    marginRight: '32px',
    mdDown: {
      margin: '8px 24px 8px 0px',
    },
  }),
  value: css.raw({
    textStyle: 'h2',
    color: 'text.light',
  }),
  label: css.raw({
    textStyle: 'subline',
    display: 'inline-flex',
    color: 'text.dark',
  }),
  obscured: css.raw({
    color: 'extracted3772',
  }),
  labelWithIcon: css.raw({
    display: 'flex',
    alignItems: 'center',
    md: {
      justifyContent: 'flex-end',
    },
  }),
  icon: css.raw({
    marginLeft: '4px',
    cursor: 'pointer',
    display: 'block',
  }),
};
