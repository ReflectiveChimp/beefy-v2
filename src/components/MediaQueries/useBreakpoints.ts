import { createContext, useContext } from 'react';
import type { BreakpointMatches } from './types';
import { createFactory } from '../../features/data/utils/factory-utils';
import { type BreakpointToken, token } from '@repo/styles/tokens';

export const defaultBreakpointMatches: BreakpointMatches = {
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
};

export const BreakpointContext = createContext<BreakpointMatches>(defaultBreakpointMatches);
BreakpointContext.displayName = 'BreakpointContext';

export const getQueries = createFactory((): Record<BreakpointToken, string> => {
  const breakpoints = ['sm', 'md', 'lg', 'xl'] as const satisfies BreakpointToken[];
  const queries = breakpoints.reduce((acc, breakpoint) => {
    acc[breakpoint] = `(min-width: ${token(`breakpoints.${breakpoint}`)})`;
    return acc;
  }, {} as Record<BreakpointToken, string>);
  console.log(queries);
  return queries;
});

export const useBreakpoints = () => useContext(BreakpointContext);
