import type { FC, SVGProps } from 'react';

export interface SimpleLinkButtonProps {
  href?: string;
  text?: string;
  className?: string;
  IconComponent?: FC<SVGProps<SVGSVGElement>>;
}
