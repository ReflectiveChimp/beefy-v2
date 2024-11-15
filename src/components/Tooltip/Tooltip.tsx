import {
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  type PropsWithoutRef,
  type ReactHTML,
  type ReactNode,
  type Ref,
  useCallback,
  useId,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectTooltipIsOpen } from '../../features/data/selectors/tooltips';
import { closeTooltip, openTooltip } from '../../features/data/reducers/tooltips';
import { type FloatingProviderProps } from '../Floating/FloatingProvider';
import { FloatingArrow, FloatingPortal, useMergeRefs } from '@floating-ui/react';
import { type HTMLStyledProps, styled } from '@repo/styles/jsx';
import { useFloating } from '../Floating/useFloating';
import type { BeefyState } from '../../redux-types';

type BaseTooltipProps = Pick<FloatingProviderProps, 'placement' | 'disabled'> & {
  content: ReactNode;
  compact?: boolean;
  dark?: boolean;
  TriggerComponent?: typeof TooltipTrigger;
  ContentComponent?: typeof TooltipContent;
  ArrowComponent?: typeof TooltipArrow;
  /** Pass exactly one child that can hold a ref and that element will be used as the trigger instead of a wrapping div */
  asChild?: boolean;
  disableHover?: boolean;
};

export type TooltipProps<T extends keyof ReactHTML = 'div'> = BaseTooltipProps &
  Omit<PropsWithoutRef<HTMLStyledProps<T>>, keyof BaseTooltipProps>;

export const Tooltip = memo(
  forwardRef(function TooltipProvider(
    {
      content,
      placement = 'top-end',
      disabled = false,
      dark = false,
      compact = false,
      TriggerComponent = TooltipTrigger,
      ContentComponent = TooltipContent,
      ArrowComponent = TooltipArrow,
      asChild = false,
      disableHover = false,
      children,
      ...triggerProps
    }: TooltipProps,
    ref
  ) {
    const [open, setOpen] = useTooltipOpen();
    const { isMounted, floating, trigger, context } = useFloating({
      open,
      onChange: setOpen,
      placement,
      disabled,
      clickEnabled: true,
      hoverEnabled: !disableHover,
      hoverTouchEnabled: !disableHover,
      arrow: true,
      role: 'tooltip',
    });
    const triggerRef = useMergeRefs([
      trigger.setRef,
      ref,
      isValidElement(children) && 'ref' in children ? (children.ref as Ref<unknown>) : null,
    ]);

    return (
      <>
        {asChild && isValidElement(children) ? (
          cloneElement(children, trigger.getProps({ ref: triggerRef, ...(children.props || {}) }))
        ) : (
          <TriggerComponent
            {...trigger.getProps(triggerProps)}
            ref={triggerRef}
            children={children}
          />
        )}
        {isMounted && (
          <FloatingPortal>
            <TooltipSizer {...floating.getProps()} ref={floating.setRef} style={floating.styles}>
              {floating.arrow && (
                <ArrowComponent ref={floating.arrow.ref} context={context} dark={dark} />
              )}
              <ContentComponent dark={dark} compact={compact}>
                {content}
              </ContentComponent>
            </TooltipSizer>
          </FloatingPortal>
        )}
      </>
    );
  })
);

const TooltipTrigger = styled('div', {
  base: {},
});

const TooltipArrow = styled(FloatingArrow, {
  base: {
    colorPalette: 'tooltip.light',
    fill: 'colorPalette.background',
  },
  variants: {
    dark: {
      true: {
        colorPalette: 'tooltip.dark',
      },
    },
  },
});

const TooltipContent = styled(
  'div',
  {
    base: {
      colorPalette: 'tooltip.light',
      textStyle: 'body-lg',
      backgroundColor: 'colorPalette.background',
      color: 'colorPalette.text',
      paddingBlock: 'var(--tooltip-content-vertical-padding, 12px)',
      paddingInline: 'var(--tooltip-content-horizontal-padding, 16px)',
      borderRadius: 'var(--tooltip-content-border-radius, 8px)',
      columnGap: 'var(--tooltip-content-horizontal-gap, 16px)',
      rowGap: 'var(--tooltip-content-vertical-gap, 8px)',
      minWidth: '50px',
    },
    variants: {
      dark: {
        true: {
          colorPalette: 'tooltip.dark',
        },
      },
      compact: {
        true: {
          '--tooltip-content-vertical-padding': '8px',
          '--tooltip-content-horizontal-padding': '8px',
          '--tooltip-content-vertical-gap': '4px',
          '--tooltip-content-horizontal-gap': '12px',
          '--tooltip-content-border-radius': '4px',
          textStyle: 'body-sm',
        },
      },
    },
  },
  {
    dataAttr: true,
  }
);

const TooltipSizer = styled('div', {
  base: {
    zIndex: 'tooltip',
    maxWidth: 'min(calc(100% - 16px), 440px)',
  },
});

function useTooltipOpen(group: string = 'default') {
  const id = useId();
  const selector = useCallback(
    (state: BeefyState) => selectTooltipIsOpen(state, id, group),
    [id, group]
  );
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selector);
  const setIsOpen = useCallback(
    (open: boolean) => {
      dispatch(open ? openTooltip({ id, group }) : closeTooltip({ id, group }));
    },
    [dispatch, id, group]
  );
  return [isOpen, setIsOpen] as const;
}
