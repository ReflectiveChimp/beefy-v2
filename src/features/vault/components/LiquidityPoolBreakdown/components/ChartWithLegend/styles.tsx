import type { Theme } from '@material-ui/core';

export const styles = (theme: Theme) => ({
  holder: {
    padding: '24px',
    display: 'flex',
    columnGap: '24px',
    alignItems: 'center',
    borderBottom: `solid 1px ${theme.palette.background.contentDark}`,
    [theme.breakpoints.up('sm')]: {
      columnGap: '48px',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column' as const,
      bottomBorder: 0,
      borderRight: `solid 1px ${theme.palette.background.contentDark}`,
    },
  },
  legend: {
    [theme.breakpoints.up('lg')]: {
      marginTop: '24px',
    },
  },
});
