import { memo, type ReactNode } from 'react';
import { useFloating, type UseFloatingProps } from './useFloating';
import { FloatingContext } from './useFloatingContext';

export type FloatingProviderProps = UseFloatingProps & {
  children: ReactNode;
};

export const FloatingProvider = memo(function FloatingProvider({
  children,
  ...rest
}: FloatingProviderProps) {
  const value = useFloating(rest);

  return <FloatingContext.Provider value={value}>{children}</FloatingContext.Provider>;
});
