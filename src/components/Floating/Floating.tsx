import type { MutableRefObject, ReactNode } from 'react';
import { memo, useLayoutEffect, useMemo } from 'react';
import {
  autoUpdate,
  flip as flipFloating,
  hide,
  type Middleware,
  offset,
  type Placement,
  shift as shiftFloating,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import { css, type CssStyles } from '@repo/styles/css';

export type FloatingProps = {
  open: boolean;
  anchorEl: MutableRefObject<HTMLElement | null>;
  children: ReactNode;
  css?: CssStyles;
  placement?: Placement;
  autoHeight?: boolean;
  autoWidth?: boolean;
  autoHide?: boolean;
  display?: string;
  shift?: boolean;
  flip?: boolean;
};
export const Floating = memo(function Floating({
  open = false,
  anchorEl,
  css: cssProp,
  children,
  placement = 'bottom-start',
  autoHeight = true,
  autoWidth = true,
  autoHide = true,
  display = 'block',
  shift = true,
  flip = true,
}: FloatingProps) {
  const middleware = useMemo(() => {
    const middlewares: Array<Middleware> = [];
    if (autoHide) middlewares.push(hide());

    middlewares.push(offset(4));
    if (flip) middlewares.push(flipFloating());
    if (shift) middlewares.push(shiftFloating());

    if (autoWidth || autoHeight) {
      middlewares.push(
        size({
          padding: 16,
          apply({ availableWidth, availableHeight, elements }) {
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
    return middlewares;
  }, [autoHide, flip, shift, autoWidth, autoHeight]);
  const {
    x,
    y,
    refs: { setReference, setFloating },
    strategy,
    middlewareData,
  } = useFloating({
    whileElementsMounted: autoUpdate,
    placement,
    middleware,
  });

  const anchorElCurrent = anchorEl.current;
  useLayoutEffect(() => {
    setReference(anchorElCurrent);
  }, [setReference, anchorElCurrent]);

  return open ? (
    <div
      className={css(cssProp)}
      ref={setFloating}
      style={{
        position: strategy,
        top: y ?? '',
        left: x ?? '',
        display: middlewareData.hide?.referenceHidden ? 'none' : display,
      }}
    >
      {children}
    </div>
  ) : null;
});
