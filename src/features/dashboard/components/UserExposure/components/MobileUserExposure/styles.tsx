import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    width: '100%',
    backgroundColor: 'background.content',
    borderRadius: '8px',
    display: 'grid',
    padding: '16px',
    mdOnly: {
      height: '120px',
    },
  }),
  option: css.raw({
    textStyle: 'body.med',
    color: 'text.dark',
    whiteSpace: 'nowrap',
    '&:hover': {
      color: 'text.light',
      cursor: 'pointer',
    },
  }),
  active: css.raw({
    color: 'text.light',
  }),
  optionsContainer: css.raw({
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    mdDown: {
      marginBottom: '24px',
    },
  }),
};
