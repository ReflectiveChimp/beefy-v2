import { useMemo, useRef, useState } from 'react';
import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip as flipMiddleware,
  offset as offsetMiddleware,
  type ReferenceType,
  shift as shiftMiddleware,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type { TooltipData, TooltipOptions } from './types';

export function useTooltip<TRef extends ReferenceType = Element>({
  placement = 'top-end',
  offset = 4,
  openOnHover = true,
  openOnFocus = true,
  variant = 'light',
  size = 'normal',
  arrowWidth = 14,
  arrowHeight = 7,
}: TooltipOptions = {}): TooltipData<TRef> {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const data = useFloating<TRef>({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offsetMiddleware(offset + arrowHeight),
      flipMiddleware({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 16,
      }),
      shiftMiddleware({ padding: 16 }),
      arrowMiddleware({ element: arrowRef, padding: 16 }),
    ],
  });
  const { context } = data;
  const hover = useHover(context, {
    move: false,
    enabled: openOnHover,
  });
  const focus = useFocus(context, {
    enabled: openOnFocus,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const interactions = useInteractions([hover, focus, dismiss, role]);
  const arrow = useMemo(
    () => ({ width: arrowWidth, height: arrowHeight, ref: arrowRef }),
    [arrowWidth, arrowHeight, arrowRef]
  );

  return useMemo(
    () => ({
      open,
      setOpen,
      variant,
      size,
      arrow,
      ...interactions,
      ...data,
    }),
    [open, setOpen, variant, size, arrow, interactions, data]
  );
}
