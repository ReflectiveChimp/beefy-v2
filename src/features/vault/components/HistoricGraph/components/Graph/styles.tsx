import { Theme } from '@material-ui/core';

export const styles = (theme: Theme) => ({
  graphContainer: {
    padding: '16px 0px',
    '& text': {
      ...theme.typography['subline-sm'],
      fill: theme.palette.text.disabled,
    },
    [theme.breakpoints.down('md')]: {
      padding: '16px 0px',
    },
  },
  graph: {
    '& .recharts-yAxis': {
      '& .recharts-cartesian-axis-tick': {
        opacity: 1,
        transition: 'ease-in-out 0.5s',
      },
    },
    '&:hover': {
      '& .recharts-yAxis': {
        '& .recharts-cartesian-axis-tick': {
          opacity: 0.5,
          transition: 'ease-in-out 0.5s',
        },
      },
    },
  },
});
