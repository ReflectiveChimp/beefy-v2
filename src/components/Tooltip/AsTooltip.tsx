import type { TooltipOptions } from './types';
import { cloneElement, memo, type ReactElement, type ReactNode, type Ref } from 'react';
import { TooltipProvider } from './TooltipProvider';
import { TooltipContent } from './TooltipContent';
import { useTooltipContext } from './useTooltipContext';
import { useMergeRefs } from '@floating-ui/react';

export type AsTooltipProps = TooltipOptions & {
  content: ReactNode;
  children: ReactElement;
};

/**
 *
 */
export const AsTooltip = memo(function AsTooltip({ children, content, ...rest }: AsTooltipProps) {
  return (
    <TooltipProvider {...rest}>
      <CloneTrigger element={children} />
      <TooltipContent>{content}</TooltipContent>
    </TooltipProvider>
  );
});

type CloneTriggerProps = {
  element: ReactElement;
};

type ElementWithRef = ReactElement & { ref?: Ref<HTMLElement> };

function isElementWithRef(element: ReactElement): element is ElementWithRef {
  return 'ref' in element;
}

const CloneTrigger = memo(function CloneTrigger({ element }: CloneTriggerProps) {
  if (!isElementWithRef(element)) {
    throw new Error('Tooltip child must hold a ref');
  }
  const { getReferenceProps, refs } = useTooltipContext();
  const mergedRef = useMergeRefs([refs.setReference, element.ref]);
  return cloneElement(element, { ...getReferenceProps(element.props), ref: mergedRef });
});
