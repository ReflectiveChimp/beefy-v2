import {
  type Placement,
  type ReferenceType,
  type UseFloatingReturn,
  type UseInteractionsReturn,
} from '@floating-ui/react';
import type { MutableRefObject } from 'react';

export type TooltipOptions = {
  placement?: Placement;
  offset?: number;
  openOnHover?: boolean;
  openOnFocus?: boolean;
  variant?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  arrowWidth?: number;
  arrowHeight?: number;
};

export type TooltipData<TRef extends ReferenceType = Element> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  arrow: {
    ref: MutableRefObject<SVGSVGElement | null>;
    width: number;
    height: number;
  };
} & UseInteractionsReturn &
  UseFloatingReturn<TRef> &
  Required<Pick<TooltipOptions, 'variant' | 'size'>>;
