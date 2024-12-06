import { ClickAwayListener } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { css, type CssStyles } from '@repo/styles/css';
import type { FC, MouseEventHandler, MutableRefObject } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Floating } from '../../../Floating';
import { styles } from '../../styles';
import type { ToggleButtonProps } from '../../ToggleButtons';
import { ToggleButton } from '../../ToggleButtons';
import { ReactComponent as MoreVertRounded } from '@repo/images/icons/mui/MoreVertRounded.svg';

const useStyles = legacyMakeStyles(styles);

interface ExtraOptionsListProps {
  ButtonComponent?: FC<ToggleButtonProps>;
  extraOptions: Record<string, string>;
  onClick: (value: string) => void;
  value: string;
  buttonCss?: CssStyles;
  selectedCss?: CssStyles;
}

export const ExtraOptionsList = memo(function ExtraOptionsList({
  extraOptions,
  ButtonComponent = ToggleButton,
  onClick,
  value,
  buttonCss,
  selectedCss,
}: ExtraOptionsListProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);
  const handleToggle = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      e.stopPropagation();
      setIsOpen(open => !open);
    },
    [setIsOpen]
  );
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const optionsList = useMemo(
    () => Object.entries(extraOptions).map(([value, label]) => ({ value, label })),
    [extraOptions]
  );

  const extraListOptionSelected = useMemo(() => {
    return Object.keys(extraOptions).includes(value);
  }, [extraOptions, value]);

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown" touchEvent="onTouchStart">
      <div
        className={css(styles.container, extraListOptionSelected && styles.selectedList)}
        onClick={handleToggle}
        ref={anchorEl}
      >
        {t('More')}
        <MoreVertRounded className={classes.icon} />
        <Floating
          open={isOpen}
          anchorEl={anchorEl as MutableRefObject<HTMLDivElement>}
          placement="bottom-end"
          css={styles.dropdown}
          display="flex"
          autoWidth={false}
        >
          {optionsList.map(({ value: optionValue, label }) => (
            <ButtonComponent
              key={optionValue}
              value={optionValue}
              label={label}
              onClick={onClick}
              css={css.raw(
                styles.buttonList,
                buttonCss,
                value === optionValue && css.raw(styles.selectedList, selectedCss)
              )}
            />
          ))}
        </Floating>
      </div>
    </ClickAwayListener>
  );
});
