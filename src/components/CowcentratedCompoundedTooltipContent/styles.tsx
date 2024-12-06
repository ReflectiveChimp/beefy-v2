import { css } from '@repo/styles/css';

export const styles = {
  container: css.raw({
    display: 'flex',
    alignItems: 'center',
    columnGap: '4px',
    textStyle: 'body.med',
    color: 'text.middle',
  }),
  tooltipTitle: css.raw({
    textStyle: 'subline.sm',
    fontWeight: '700',
    color: 'var(--tooltip-title-color)',
  }),
  rewardsContainer: css.raw({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '4px',
  }),
  rewardsText: css.raw({
    textStyle: 'body.med',
    color: 'var(--tooltip-value-color)',
  }),
  usdPrice: css.raw({
    textStyle: 'subline.sm',
    fontWeight: '700',
    color: 'var(--tooltip-title-color)',
  }),
};
