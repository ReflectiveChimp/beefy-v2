import type { Theme } from '@material-ui/core';

export const styles = (theme: Theme) => ({
  grid: {
    ...theme.typography['body-lg'],
    display: 'grid',
    rowGap: '8px',
    columnGap: '48px',
    gridTemplateColumns: '1fr auto',
  },
  label: {
    color: 'var(--colors-color-palette-text-title)',
  },
  details: {
    color: 'var(--colors-color-palette-text-title)',
    textAlign: 'right' as const,
  },
  amount: {},
  value: {
    ...theme.typography['subline-sm'],
    display: 'none' as const,
  },
  notInBoost: {
    gridColumn: '1 / span 2',
    fontWeight: theme.typography['body-lg-med'].fontWeight,
  },
});
