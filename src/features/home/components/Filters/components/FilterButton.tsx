import { styled } from '@repo/styles/jsx';
import { Button } from '../../../../../components/Button';
import { cva } from '@repo/styles/css';
import { buttonRecipe } from '../../../../../components/Button/styles';
import { FloatingTrigger } from '../../../../../components/Floating/FloatingTrigger';

const filterButtonRecipe = cva({
  base: {
    width: 'auto',
    flexBasis: 'calc(50% - 8px)',
    flexShrink: 0,
    flexGrow: 1,
    md: {
      flexBasis: 'auto',
      flexGrow: 0,
      flexShrink: 0,
    },
  },
});

export const FilterButton = styled(Button, filterButtonRecipe, {
  defaultProps: { variant: 'filter', size: 'sm' },
});

export const FilterTriggerButton = styled(
  styled(FloatingTrigger, buttonRecipe),
  filterButtonRecipe,
  {
    defaultProps: { variant: 'filter', size: 'sm' },
  }
);
