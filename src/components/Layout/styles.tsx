import { css } from '@repo/styles/css';

export const styles = {
  wrapper: css.raw({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'background.body',
  }),
  top: css.raw({
    flex: '0 0 auto',
  }),
  middle: css.raw({
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  }),
  bottom: css.raw({
    flex: '0 0 auto',
  }),
};
