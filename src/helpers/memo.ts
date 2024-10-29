import { isBigNumber } from './big-number';
import { type FunctionComponent, memo, type NamedExoticComponent } from 'react';

/** React's default shallowEqual but with support for BigNumber */
export function bigShallowEqual<P extends object>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>
): boolean {
  if (Object.is(prevProps, nextProps)) {
    return true;
  }

  if (
    typeof prevProps !== 'object' ||
    prevProps === null ||
    typeof nextProps !== 'object' ||
    nextProps === null
  ) {
    return false;
  }

  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (let i = 0; i < prevKeys.length; i++) {
    const key = prevKeys[i];
    if (!Object.hasOwn(nextProps, key)) {
      return false;
    }
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];
    if (!Object.is(prevValue, nextValue)) {
      if (!isBigNumber(prevValue) || !isBigNumber(nextValue) || !prevValue.eq(nextValue)) {
        return false;
      }
    }
  }

  return true;
}

/*@__NO_SIDE_EFFECTS__*/
export function bigMemo<T extends object>(
  component: FunctionComponent<T>
): NamedExoticComponent<T> {
  return memo<T>(component, bigShallowEqual);
}
