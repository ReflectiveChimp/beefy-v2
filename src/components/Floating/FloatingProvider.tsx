import { createContext, memo, type MutableRefObject, type ReactNode, useContext } from 'react';
import { useFloating, type UseFloatingProps } from './useFloating';

export type FloatingContextValue = ReturnType<typeof useFloating> & {
  arrowClass?: string;
  referenceRef?: MutableRefObject<Element | null>;
};

const FloatingContext = createContext<FloatingContextValue | null>(null);

export const useFloatingContext = () => useContext(FloatingContext);

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
