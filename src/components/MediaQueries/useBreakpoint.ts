import { useBreakpoints } from './useBreakpoints';
import { useMemo } from 'react';
import type { Breakpoint, BreakpointMatches, FromOrToProp } from './types';

export function useBreakpoint(opts: FromOrToProp) {
  const breakpoints = useBreakpoints();
  return useMemo(() => {
    if ('from' in opts && opts.from) {
      return isFrom(opts.from, breakpoints);
    } else if ('to' in opts && opts.to) {
      return isUpTo(opts.to, breakpoints);
    } else {
      throw new Error('up or down prop is required');
    }
  }, [breakpoints, opts]);
}

export const breakpointKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies Breakpoint[];

/**
 * inclusive
 * isUpTo(xs) returns true when xs: true and sm: false
 * isUpTo(sm) return true when xs: true or sm: true, and md: false
 * */
function isUpTo(breakpoint: Breakpoint, breakpoints: BreakpointMatches) {
  const index = breakpointKeys.indexOf(breakpoint);
  if (index < breakpointKeys.length - 1) {
    const nextBreakpoint = breakpointKeys[index + 1];
    if (breakpoints[nextBreakpoint]) {
      return false;
    }
  }

  for (let i = index; i >= 0; --i) {
    if (breakpoints[breakpointKeys[i]]) {
      return true;
    }
  }

  return false;
}

function isFrom(breakpoint: Breakpoint, breakpoints: BreakpointMatches) {
  return breakpoints[breakpoint];
}
