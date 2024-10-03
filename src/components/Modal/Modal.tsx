import { memo, type MouseEvent, useCallback, useEffect, useRef } from 'react';
import { cva } from '@styles/css';
import { styled } from '@styles/jsx';
import type { ModalProps } from './types';
import { createPortal } from 'react-dom';

const Dialog = styled(
  'dialog',
  cva({
    base: {
      margin: 'auto',
      maxWidth: 'calc(100% - 48px)',
      maxHeight: 'calc(100% - 48px)',
      padding: '0',
      background: 'none',
      outline: 'none',
      border: 'none',
      '&::backdrop': {
        backgroundColor: 'modal.backdrop',
        backdropFilter: 'blur(8px)',
      },
    },
  })
);

export const Modal = memo<ModalProps>(function Modal({ open, onClose, children }) {
  const ref = useRef<HTMLDialogElement>(null);
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return createPortal(
    <Dialog ref={ref} onClose={onClose} onClick={handleClick}>
      {open ? children : null}
    </Dialog>,
    document.body
  );
});
