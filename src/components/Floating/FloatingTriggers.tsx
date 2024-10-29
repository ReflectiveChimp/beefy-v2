import type { HTMLStyledProps } from '@repo/styles/types';
import { createElement, memo, type ReactHTML } from 'react';
import { useFloatingContext } from './FloatingProvider';

export const FloatingButtonTrigger = createFloatingTrigger('button');
export const FloatingDivTrigger = createFloatingTrigger('div');

function createFloatingTrigger<T extends keyof ReactHTML>(tag: T) {
  const Component = function FloatingTrigger({ ref, ...props }: HTMLStyledProps<T>) {
    const floatingContext = useFloatingContext();
    if (!floatingContext) {
      throw new Error('FloatingTrigger must be used within a FloatingProvider');
    }
    const { trigger } = floatingContext;
    return createElement(tag, { ...trigger.getProps(props), ref: trigger.setRef ?? ref });
  };

  Component.displayName = `FloatingTrigger.${tag}`;

  return memo(Component);
}
