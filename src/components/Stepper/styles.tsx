import { css } from '@repo/styles/css';

export const styles = {
  snackbar: css.raw({
    width: '408px',
    maxWidth: 'calc(100% - 16px)',
    maxHeight: 'calc(100% - 16px)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  }),
  snackbarContainer: css.raw({
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '0',
  }),
  contentContainer: css.raw({
    backgroundColor: 'white',
    borderRadius: '0 0 4px 4px',
    padding: '12px 16px',
    minHeight: '0',
    flexShrink: '1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  }),
};
