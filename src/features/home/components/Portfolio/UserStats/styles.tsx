import { css } from '@repo/styles/css';

export const styles = {
  userStats: css.raw({
    display: 'flex',
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
  blurred: css.raw({
    filter: 'blur(.5rem)',
  }),
  obscured: css.raw({
    color: 'extracted3772',
  }),
};
