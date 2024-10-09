import { styled } from '@styles/jsx';

export const Container = styled('div', {
  base: {
    width: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0px 16px',
    sm: {
      padding: '0px 24px',
    },
  },
  variants: {
    maxWidth: {
      xl: {
        maxWidth: '100%',
      },
      lg: {
        maxWidth: 'container.lg',
      },
      md: {
        maxWidth: 'container.md',
      },
      sm: {
        maxWidth: 'container.sm',
      },
      xs: {
        maxWidth: 'container.xs',
      },
    },
  },
  defaultVariants: {
    maxWidth: 'xl',
  },
});
