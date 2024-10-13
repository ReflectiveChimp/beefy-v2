import type { HTMLStyledProps } from '@styles/types';
import { memo } from 'react';
import { useFloatingContext } from './FloatingProvider';
import { FloatingArrow, FloatingFocusManager, FloatingPortal } from '@floating-ui/react';

type FloatingDropdownProps = HTMLStyledProps<'div'>;

export const FloatingDropdown = memo(function FloatingDropdown(props: FloatingDropdownProps) {
  const floatingContext = useFloatingContext();
  if (!floatingContext) {
    throw new Error('FloatingDropdown must be used within a FloatingProvider');
  }
  const { isOpen, floating } = floatingContext;
  if (!isOpen) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floating.context} modal={false}>
        <div {...floating.getProps()} ref={floating.setRef} style={floating.styles}>
          {floating.arrow && (
            <FloatingArrow
              ref={floating.arrow.ref}
              context={floating.context}
              className={floating.arrow.className}
            />
          )}
          <div {...props} />
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});
