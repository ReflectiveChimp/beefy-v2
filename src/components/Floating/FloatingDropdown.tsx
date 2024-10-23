import type { HTMLStyledProps } from '@repo/styles/types';
import { memo } from 'react';
import { useFloatingContext } from './FloatingProvider';
import { FloatingArrow, FloatingFocusManager, FloatingPortal } from '@floating-ui/react';

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
      <FloatingFocusManager context={context} modal={false}>
        <div {...floating.getProps()} ref={floating.setRef} style={floating.styles}>
          {floating.arrow && (
            <FloatingArrow
              ref={floating.arrow.ref}
              context={context}
              className={floating.arrow.className}
            />
          )}
          <div {...props} />
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});
