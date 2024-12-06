import type { Placement } from '@floating-ui/react-dom';
import { type HTMLProps, type MutableRefObject, useMemo, useRef, useState } from 'react';
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
  type UseRoleProps,
} from '@floating-ui/react';

export type UseFloatingProps = {
  open?: boolean;
  onChange?: (open: boolean) => void;
  disabled?: boolean;
  placement?: Placement;
  /** If provided will render an arrow SVG, if string will add as className to the element */
  arrow?: boolean | string;
  /** Reference to the element that the floating element should be positioned relative to, defaults to FloatingTrigger */
  triggerRef?: MutableRefObject<Element | null>;
  /** Will grow to use all vertical room in page */
  autoHeight?: boolean;
  /** Will grow to same width as trigger reference element */
  autoWidth?: boolean;
  hoverEnabled?: boolean;
  hoverCloseDelay?: number;
  hoverTouchEnabled?: boolean;
  clickEnabled?: boolean;
  role?: UseRoleProps['role'];
  layer?: 0 | 1 | 2;
  flipEnabled?: boolean;
  shiftEnabled?: boolean;
};

export function useFloating({
  open: controlledOpen,
  onChange: controlledOnChange,
  placement = 'bottom-start',
  arrow,
  triggerRef,
  disabled = false,
  autoHeight = false,
  autoWidth = false,
  clickEnabled = true,
  hoverEnabled = false,
  hoverTouchEnabled = false,
  hoverCloseDelay = 0,
  role,
  layer = 0,
  flipEnabled = true,
  shiftEnabled = true,
}: UseFloatingProps) {
  const [uncontrolledOpen, uncontrolledOnChange] = useState(false);
  const open = disabled ? false : controlledOpen ?? uncontrolledOpen;
  const onOpenChange = controlledOnChange ?? uncontrolledOnChange;
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const middleware = useMemo(() => {
    const wares = [offsetMiddleware(/*4 +*/ arrowRef ? 7 : 0)];
    if (arrow) {
      wares.push(arrowMiddleware({ element: arrowRef, padding: 10 }));
    }
    if (flipEnabled) {
      wares.push(
        flipMiddleware({
          crossAxis: true /*placement.includes('-')*/,
          fallbackAxisSideDirection: 'none', //'end',
          padding: 24,
          fallbackStrategy: 'bestFit',
          altBoundary: false,
        })
      );
    }
    if (shiftEnabled) {
      wares.push(shiftMiddleware());
    }
    if (autoHeight || autoWidth) {
      wares.push(
        sizeMiddleware({
          padding: 16,
          apply({ availableHeight, availableWidth, elements }) {
            if (autoWidth) {
              elements.floating.style.width =
                elements.reference.getBoundingClientRect().width + 'px';
              elements.floating.style.maxWidth = availableWidth + 'px';
            }
            if (autoHeight) {
              elements.floating.style.maxHeight = availableHeight + 'px';
            }
          },
        })
      );
    }
    return wares;
  }, [arrowRef, arrow, autoHeight, autoWidth, flipEnabled, shiftEnabled]);
  const data = useFloatingBase({
    placement,
    open,
    onOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
    elements: triggerRef ? { reference: triggerRef.current } : undefined,
  });
  const clickInteraction = useClick(data.context, {
    enabled: !disabled && clickEnabled,
  });
  const hoverInteraction = useHover(data.context, {
    enabled: !disabled && hoverEnabled,
    mouseOnly: !hoverTouchEnabled,
    delay: {
      close: hoverCloseDelay,
    },
  });
  const dismissInteraction = useDismiss(data.context, {
    enabled: !disabled,
  });
  const roleInteraction = useRole(data.context, {
    enabled: !disabled && !!role,
    role: role || 'tooltip',
  });
  const interactions = useInteractions([
    clickInteraction,
    dismissInteraction,
    roleInteraction,
    hoverInteraction,
  ]);
  const getReferenceProps = useMemo(() => {
    if (!disabled && hoverEnabled && hoverTouchEnabled) {
      return (userProps?: HTMLProps<Element> | undefined) =>
        interactions.getReferenceProps({
          ...(userProps || {}),
          onClick(e) {
            // prevent parent click events when "hovering" via touch
            e.stopPropagation();
            e.preventDefault();
            userProps?.onClick?.(e);
          },
        });
    }
    return interactions.getReferenceProps;
  }, [interactions, disabled, hoverEnabled, hoverTouchEnabled]);

  return useMemo(
    () => ({
      isOpen: open,
      isMounted: open, // future support for transitions
      setIsOpen: onOpenChange,
      context: data.context,
      trigger: {
        setRef: triggerRef ? undefined : data.refs.setReference,
        ref: triggerRef ?? data.refs.reference,
        getProps: getReferenceProps,
      },
      floating: {
        styles: data.floatingStyles,
        getProps: interactions.getFloatingProps,
        setRef: data.refs.setFloating,
        ref: data.refs.floating,
        arrow: arrow
          ? { ref: arrowRef, className: typeof arrow === 'string' ? arrow : undefined }
          : undefined,
        layer,
      },
    }),
    [open, onOpenChange, interactions, data, arrowRef, arrow, triggerRef, getReferenceProps, layer]
  );
}
