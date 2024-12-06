import { css } from '@repo/styles/css';

export const styles = {
  link: css.raw({
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    backgroundColor: 'background.content.light',
    padding: '2px 8px',
    borderRadius: '4px',
    color: 'text.middle',
  }),
  icon: css.raw({
    fontSize: 'inherit',
    marginRight: '4px',
  }),
} as const;
