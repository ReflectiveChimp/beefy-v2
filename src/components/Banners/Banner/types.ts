import type { ReactNode } from 'react';

export type BannerProps = {
  icon?: ReactNode;
  text: ReactNode;
  onClose?: () => void;
  className?: string;
  variant?: 'info' | 'warning' | 'error';
};

export type DismissibleBannerProps = Exclude<BannerProps, 'onClose'> & {
  id: string;
};
