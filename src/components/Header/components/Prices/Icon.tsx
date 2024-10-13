import { cva } from '@styles/css';
import { styled } from '@styles/jsx';

const iconRecipe = cva({
  base: {
    display: 'block',
    height: '24px',
    width: '24px',
  },
  variants: {
    first: {
      true: {
        gridColumnStart: 1,
      },
    },
  },
});

export const Icon = styled('img', iconRecipe, {
  defaultProps: {
    height: '24',
    width: '24',
  },
});
