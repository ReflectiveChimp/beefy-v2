import type { HTMLStyledProps } from '@repo/styles/types';
import { memo } from 'react';
import { useFloatingContext } from './FloatingProvider';

type FloatingTriggerProps = HTMLStyledProps<'button'>;

export const FloatingTrigger = memo(function FloatingTrigger(props: FloatingTriggerProps) {
  const floatingContext = useFloatingContext();
  if (!floatingContext) {
    throw new Error('FloatingTrigger must be used within a FloatingProvider');
  }
  const { reference } = floatingContext;
  return <button {...reference.getProps(props)} ref={reference.setRef ?? undefined} />;
});
