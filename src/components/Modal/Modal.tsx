import { memo, type MouseEvent, useCallback, useEffect, useRef } from 'react';
import { sva } from '@styles/css';
import type { ModalProps } from './types';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

const useStyles = sva({
  slots: ['backdrop', 'dialog'],
  base: {
    backdrop: {
      display: 'flex',
      position: 'fixed',
      backgroundColor: 'modal.backdrop',
      backdropFilter: 'blur(8px)',
      width: '100%',
      height: '100%',
      inset: 0,
    },
    dialog: {
      display: 'flex',
      minHeight: '0',
      minWidth: '0',
      maxWidth: '100%',
      margin: 'auto',
      padding: { sm: '24px' },
    },
  },
  variants: {
    scrollable: {
      false: {
        dialog: {
          maxHeight: '100%',
        },
      },
      true: {
        backdrop: {
          overflowY: 'auto',
        },
      },
    },
    layer: {
      0: {
        backdrop: {
          zIndex: 'modal',
        },
      },
      1: {
        backdrop: {
          zIndex: 'layer1.modal',
        },
      },
      2: {
        backdrop: {
          zIndex: 'layer2.modal',
        },
      },
    },
  },
  defaultVariants: {
    layer: 0,
    scrollable: false,
  },
});

export const Modal = memo<ModalProps>(function Modal({ open, ...rest }) {
  return open ? <ModalOpen {...rest} /> : null;
});

const ModalOpen = memo<Omit<ModalProps, 'open'>>(function ModalOpen({
  layer,
  scrollable,
  onClose,
  children,
}) {
  const classes = useStyles({ layer, scrollable });
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && e.target && e.target instanceof Element) {
        if (!['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(e.target.nodeName)) {
          e.stopImmediatePropagation();
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className={clsx('modal', classes.backdrop)}
      ref={ref}
      onClick={handleClick}
      data-open={true}
    >
      <div className={classes.dialog}>{children}</div>
    </div>,
    document.body
  );
});
