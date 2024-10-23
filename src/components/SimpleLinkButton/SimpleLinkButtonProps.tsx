import type { ComponentProps, FC } from 'react';

export interface SimpleLinkButtonProps {
  href?: string;
  text?: string;
  className?: string;
  IconComponent?: FC<ComponentProps<'svg'>>;
}
