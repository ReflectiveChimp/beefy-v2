import type { HTMLStyledProps } from '@repo/styles/types';
import { memo } from 'react';
import { FloatingArrow, FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { styled } from '@repo/styles/jsx';
import { useFloatingContext } from './useFloatingContext';

type FloatingDropdownProps = HTMLStyledProps<'div'>;

export const FloatingDropdown = memo(function FloatingDropdown(props: FloatingDropdownProps) {
  const floatingContext = useFloatingContext();
  if (!floatingContext) {
    throw new Error('FloatingDropdown must be used within a FloatingProvider');
  }
  const { isMounted, floating, context } = floatingContext;
  if (!isMounted) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false} initialFocus={0}>
        <FloatingElement
          {...floating.getProps()}
          ref={floating.setRef}
          style={floating.styles}
          layer={floating.layer}
        >
          {floating.arrow && (
            <FloatingArrow
              ref={floating.arrow.ref}
              context={context}
              className={floating.arrow.className}
            />
          )}
          <div {...props} />
        </FloatingElement>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});

const FloatingElement = styled('div', {
  base: {},
  variants: {
    layer: {
      0: {
        zIndex: 'dropdown',
      },
      1: {
        zIndex: 'layer1.dropdown',
      },
      2: {
        zIndex: 'layer2.dropdown',
      },
    },
  },
  defaultVariants: {
    layer: 0,
  },
});
