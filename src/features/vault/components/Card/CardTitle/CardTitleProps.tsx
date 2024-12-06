import type { ReactNode } from 'react';
import { type CssStyles } from '@repo/styles/css';

export interface CardTitleProps {
  title: string | ReactNode;
  subtitle?: string;
  titleCss?: CssStyles;
}
