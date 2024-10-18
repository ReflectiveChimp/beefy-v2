import type { Placement } from '@floating-ui/react-dom';
import { type MutableRefObject, useMemo, useRef, useState } from 'react';
import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip as flipMiddleware,
  offset as offsetMiddleware,
  shift as shiftMiddleware,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useFloating as useFloatingBase,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';

export type UseFloatingProps = {
  open?: boolean;
  onChange?: (open: boolean) => void;
  placement?: Placement;
  /** If provided will render an arrow SVG, if string will add as className to the element */
  arrow?: boolean | string;
  /** Reference to the element that the floating element should be positioned relative to, defaults to FloatingTrigger */
  referenceRef?: MutableRefObject<Element | null>;
  autoHeight?: boolean;
  hover?: boolean;
};

export function useFloating({
  open: controlledOpen,
  onChange: controlledOnChange,
  placement = 'bottom-start',
  arrow,
  referenceRef,
  autoHeight = false,
  hover = false,
}: UseFloatingProps) {
  const [uncontrolledOpen, uncontrolledOnChange] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChange = controlledOnChange ?? uncontrolledOnChange;
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const middleware = useMemo(() => {
    const wares = [
      offsetMiddleware(4 + (arrowRef ? 7 : 0)),
      flipMiddleware({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
      }),
      shiftMiddleware(),
    ];
    if (arrow) {
      wares.push(arrowMiddleware({ element: arrowRef }));
    }
    if (autoHeight) {
      wares.push(
        sizeMiddleware({
          padding: 16,
          apply({ availableHeight, elements }) {
            elements.floating.style.maxHeight = availableHeight + 'px';
          },
        })
      );
    }
    return wares;
  }, [placement, arrowRef, arrow, autoHeight]);
  const data = useFloatingBase({
    placement,
    open,
    onOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
    elements: referenceRef ? { reference: referenceRef.current } : undefined,
  });
  const clickInteraction = useClick(data.context, {
    enabled: !controlledOnChange,
  });
  const hoverInteraction = useHover(data.context, {
    enabled: hover,
    mouseOnly: true,
    delay: {
      close: 200,
    },
  });
  const dismissInteraction = useDismiss(data.context);
  const roleInteraction = useRole(data.context);
  const interactions = useInteractions([
    clickInteraction,
    dismissInteraction,
    roleInteraction,
    hoverInteraction,
  ]);

  return useMemo(
    () => ({
      isOpen: open,
      isMounted: open, // future support for transitions
      setIsOpen: onOpenChange,
      context: data.context,
      reference: {
        setRef: referenceRef ? undefined : data.refs.setReference,
        ref: referenceRef ?? data.refs.reference,
        getProps: interactions.getReferenceProps,
      },
      floating: {
        styles: data.floatingStyles,
        getProps: interactions.getFloatingProps,
        setRef: data.refs.setFloating,
        ref: data.refs.floating,
        arrow: arrow
          ? { ref: arrowRef, className: typeof arrow === 'string' ? arrow : undefined }
          : undefined,
      },
    }),
    [open, onOpenChange, interactions, data, arrowRef, arrow, referenceRef]
  );
}
