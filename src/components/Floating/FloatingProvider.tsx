import { createContext, memo, type MutableRefObject, type ReactNode, useContext } from 'react';
import { useFloating, type UseFloatingProps } from './useFloating';

export type FloatingContextValue = ReturnType<typeof useFloating> & {
  arrowClass?: string;
  referenceRef?: MutableRefObject<Element | null>;
};

const FloatingContext = createContext<FloatingContextValue | null>(null);

export const useFloatingContext = () => useContext(FloatingContext);

export type FloatingProviderProps = Omit<UseFloatingProps, 'arrowRef'> & {
  arrow?: boolean | string;
  referenceRef?: MutableRefObject<Element | null>;
  children: ReactNode;
  autoHeight?: boolean;
  hover?: boolean;
};

export const FloatingProvider = memo(function FloatingProvider({
  open,
  onChange,
  placement = 'bottom-start',
  arrow,
  referenceRef,
  children,
  autoHeight = false,
  hover = false,
}: FloatingProviderProps) {
  const value = useFloating({
    open,
    onChange,
    placement,
    arrow,
    referenceRef,
    autoHeight,
    hover,
  });

  return <FloatingContext.Provider value={value}>{children}</FloatingContext.Provider>;
});
