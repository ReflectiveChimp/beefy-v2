import type { ReactNode } from 'react';

export interface CardTitleProps {
  title: string | ReactNode;
  subtitle?: string;
  titleClassName?: string;
}
