import { styled } from '@styles/jsx';
import type { FunctionComponent, SVGProps } from 'react';
import type { RecipeVariantRecord } from '@styles/types';
import { ArrowForwardIosRounded } from '@material-ui/icons';

export const RightArrow = styled<FunctionComponent<SVGProps<SVGSVGElement>>, RecipeVariantRecord>(
  ArrowForwardIosRounded,
  {
    base: {
      height: '12px',
      marginLeft: 'auto',
    },
  }
);
