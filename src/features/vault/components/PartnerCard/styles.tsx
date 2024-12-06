import { css } from '@repo/styles/css';

export const styles = {
  link: css.raw({
    textDecoration: 'none',
  }),
  container: css.raw({
    marginTop: '16px',
    backgroundColor: 'background.content.light',
    padding: '16px',
    borderRadius: '12px',
    '&:Hover': {
      backgroundColor: 'bayOfMany',
    },
  }),
  title: css.raw({
    textStyle: 'body.med',
    color: 'text.light',
    display: 'flex',
  }),
  icon: css.raw({
    height: '24px',
    width: '24px',
    marginRight: '8px',
  }),
  content: css.raw({
    marginTop: '16px',
    textStyle: 'body',
    color: 'text.middle',
  }),
};
