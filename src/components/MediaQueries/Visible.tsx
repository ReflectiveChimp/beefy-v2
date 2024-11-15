import { memo } from 'react';
import type { VisibleProps } from './types';
import { useBreakpoint } from './useBreakpoint';

export const Visible = memo(function Visible({
  children,
  else: elseChildren,
  ...rest
}: VisibleProps) {
  const shouldShow = useBreakpoint(rest);

  return shouldShow ? children : elseChildren || null;
});
