import type { Theme } from '@material-ui/core';

export const styles = (theme: Theme) => ({
  card: {
    margin: 0,
    outline: 'none',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    width: '500px',
    maxWidth: '100%',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '18px 24px',
    background: theme.palette.background.contentDark,
    borderRadius: '10px 10px 0px 0px ',
    borderBottom: `2px solid ${theme.palette.background.border}`,
  },
  cardIcon: {
    marginRight: '8px',
    height: '32px',
  },
  cardTitle: {
    color: theme.palette.text.light,
    marginRight: 'auto',
  },
  closeButton: {
    '&:hover': {
      background: 'none',
    },
  },
  cardContent: {
    background: theme.palette.background.contentPrimary,
    borderRadius: '0 0 12px 12px',
    padding: '24px',
    minHeight: '200px',
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
});
