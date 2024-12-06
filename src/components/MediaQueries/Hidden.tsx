import { memo } from 'react';
import type { VisibleProps } from './types';
import { useBreakpoint } from './useBreakpoint';

export const Hidden = memo(function Hidden({
  children,
  else: elseChildren,
  ...rest
}: VisibleProps) {
  const shouldHide = useBreakpoint(rest);

  return shouldHide ? elseChildren || null : children;
});
