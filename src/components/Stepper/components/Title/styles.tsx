import { css } from '@repo/styles/css';

export const styles = {
  title: css.raw({
    textStyle: 'body.med',
    color: 'blackMarket1',
    display: 'flex',
    alignItems: 'center',
  }),
  titleContainer: css.raw({
    display: 'flex',
    justifyContent: 'space-between',
    flexShrink: '0',
    marginBottom: '4px',
  }),
  closeIcon: css.raw({
    padding: '0',
  }),
};
