import { css } from '@repo/styles/css';

export const styles = {
  chartContainer: css.raw({
    padding: '16px 0px',
    lgDown: {
      padding: '16px 0px',
    },
  }),
  graph: css.raw({
    '& text': {
      textStyle: 'subline.sm',
      fill: 'text.dark',
    },
    '& .recharts-yAxis': {
      '& .recharts-cartesian-axis-tick': {
        opacity: '1',
        transition: 'ease-in-out 0.5s',
      },
    },
    '&:hover': {
      '& .recharts-yAxis': {
        '& .recharts-cartesian-axis-tick': {
          opacity: '0.5',
          transition: 'ease-in-out 0.5s',
        },
      },
    },
  }),
  cowcentratedHeader: css.raw({
    display: 'grid',
    gap: '1px',
    gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
  }),
  cowcentratedStat: css.raw({
    backgroundColor: 'background.content',
    padding: '16px 24px',
  }),
  label: css.raw({
    textStyle: 'body.sm.med',
    fontWeight: '700',
    color: 'text.dark',
    textTransform: 'uppercase',
  }),
  inRange: css.raw({
    color: 'green',
  }),
  outOfRange: css.raw({
    color: 'orangeBoost',
  }),
  value: css.raw({
    textStyle: 'body.med',
    fontWeight: '500',
    color: 'text.white',
    '& span': {
      textStyle: 'body.sm.med',
      fontWeight: '700',
      textTransform: 'uppercase',
      color: 'text.dark',
    },
  }),
  roundBottomLeft: css.raw({
    borderBottomLeftRadius: '8px',
  }),
  roundBottomRight: css.raw({
    borderBottomRightRadius: '8px',
  }),
};
