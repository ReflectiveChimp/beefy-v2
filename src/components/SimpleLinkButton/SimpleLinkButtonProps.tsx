import type { FC, SVGProps } from 'react';
import { type CssStyles } from '@repo/styles/css';

export interface SimpleLinkButtonProps {
  href?: string;
  text?: string;
  css?: CssStyles;
  IconComponent?: FC<SVGProps<SVGSVGElement>>;
}
