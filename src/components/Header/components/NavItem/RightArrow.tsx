import { styled } from '@repo/styles/jsx';
import type { FunctionComponent, SVGProps } from 'react';
import type { RecipeVariantRecord } from '@repo/styles/types';
import { ReactComponent as ArrowForwardIosRounded } from '@repo/images/icons/mui/ArrowForwardIosRounded.svg';

export const RightArrow = styled<FunctionComponent<SVGProps<SVGSVGElement>>, RecipeVariantRecord>(
  ArrowForwardIosRounded,
  {
    base: {
      height: '12px',
      marginLeft: 'auto',
    },
  }
);
