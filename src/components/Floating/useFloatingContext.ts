import { createContext, type MutableRefObject, useContext } from 'react';
import type { useFloating } from './useFloating';

export type FloatingContextValue = ReturnType<typeof useFloating> & {
  arrowClass?: string;
  referenceRef?: MutableRefObject<Element | null>;
};

export const FloatingContext = createContext<FloatingContextValue | null>(null);

export const useFloatingContext = () => useContext(FloatingContext);
