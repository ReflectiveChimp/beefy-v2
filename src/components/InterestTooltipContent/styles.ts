import type { Theme } from '@material-ui/core';

export const styles = (theme: Theme) => ({
  rows: {
    ...theme.typography['body-lg'],
    display: 'grid',
    rowGap: '8px',
    columnGap: '48px',
    gridTemplateColumns: '1fr auto',
  },
  label: {
    color: 'var(--colors-color-palette-text-label)',
    '&:nth-last-child(2)': {
      fontWeight: theme.typography['body-lg-med'].fontWeight,
      color: 'var(--colors-color-palette-text-title)',
    },
  },
  value: {
    color: 'var(--colors-color-palette-text-item)',
    textAlign: 'right' as const,
    '&:last-child': {
      fontWeight: theme.typography['body-lg-med'].fontWeight,
      color: 'var(--colors-color-palette-text-label)',
    },
  },
});
