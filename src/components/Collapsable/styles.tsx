import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    padding: '24',
    borderRadius: '12px',
    backgroundColor: 'background.content',
  }),
  content: css.raw({
    padding: '16',
  }),
  title: css.raw({
    display: 'flex',
    padding: '0',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    '&:Hover': {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  }),
  titleIcon: css.raw({
    fill: 'text.dark',
  }),
};
