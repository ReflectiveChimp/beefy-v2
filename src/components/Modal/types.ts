import type { ReactNode } from 'react';

export type ModalProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  layer?: 0 | 1 | 2;
  scrollable?: boolean;
};
