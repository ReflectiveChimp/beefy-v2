import { memo, useCallback } from 'react';
import type { ClickAwayListenerProps } from '@material-ui/core';
import { ClickAwayListener, Portal } from '@material-ui/core';
import { styles } from './styles';
import type { FloatingProps } from '../Floating';
import { Floating } from '../Floating';
import { css, type CssStyles } from '@repo/styles/css';

export type DropdownProps = Omit<FloatingProps, 'autoHeight' | 'autoWidth' | 'className'> & {
  onClose: () => void;
  dropdownCss?: CssStyles;
  innerCss?: CssStyles;
};

export const Dropdown = memo(function Dropdown({
  onClose,
  children,
  dropdownCss,
  innerCss,
  ...rest
}: DropdownProps) {
  const handleClose = useCallback<ClickAwayListenerProps['onClickAway']>(
    e => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <Portal>
      <Floating
        {...rest}
        autoHeight={false}
        autoWidth={false}
        css={css.raw(styles.dropdown, dropdownCss)}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div className={css(styles.dropdownInner, innerCss)}>{children}</div>
        </ClickAwayListener>
      </Floating>
    </Portal>
  );
});
