import type { FC, MouseEventHandler, ReactNode } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { ClickAwayListener } from '@material-ui/core';
import { orderBy } from 'lodash-es';
import { styles as baseStyles } from './styles';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { css, type CssStyles } from '@repo/styles/css';
import { Floating } from '../Floating';
import type { Placement } from '@floating-ui/react-dom';
import { entries } from '../../helpers/object';

export type LabeledSelectCommonProps<V extends string = string> = {
  label?: string;
  options: Partial<Record<V, string>>;
  placement?: Placement;
  sortOptions?: 'default' | 'value' | 'label';
  fullWidth?: boolean;
  borderless?: boolean;
  disabled?: boolean;
  selectCss?: CssStyles;
  selectCurrentCss?: CssStyles;
  selectLabelCss?: CssStyles;
  selectValueCss?: CssStyles;
  selectIconCss?: CssStyles;
  selectFullWidthCss?: CssStyles;
  selectBorderlessCss?: CssStyles;
  selectOpenCss?: CssStyles;
  selectOpenIconCss?: CssStyles;
  dropdownCss?: CssStyles;
  dropdownItemCss?: CssStyles;
  dropdownItemSelectedCss?: CssStyles;
  dropdownAutoWidth?: boolean;
  dropdownAutoHeight?: boolean;
  dropdownAutoHide?: boolean;
  dropdownFlip?: boolean;
  dropdownShift?: boolean;
};

export type LabeledSelectProps<V extends string = string> = LabeledSelectCommonProps<V> & {
  value: V;
  defaultValue?: V | 'default';
  onChange: (value: V) => void;
  SelectedItemComponent?: FC<SelectedItemProps<V>>;
  DropdownItemComponent?: FC<DropdownItemProps<V>>;
  DropdownItemLabelComponent?: FC<DropdownItemLabelProps<V>>;

  showArrow?: boolean;
};

type DropdownItemProps<V extends string = string> = {
  label: string;
  value: V;
  onChange: (value: V) => void;
  css?: CssStyles;
  DropdownItemLabelComponent?: FC<DropdownItemLabelProps<V>>;
};

export type DropdownItemLabelProps<V extends string = string> = {
  label: ReactNode;
  value: V;
};

export type SelectedItemProps<V extends string = string> = {
  value: LabeledSelectProps<V>['value'];
  options: LabeledSelectProps<V>['options'];
};

function useSortedOptions<V extends string = string>(
  options: LabeledSelectProps<V>['options'],
  sort: LabeledSelectProps<V>['sortOptions'],
  defaultValue: LabeledSelectProps<V>['defaultValue']
): {
  value: V;
  label: string;
  isDefault: boolean;
}[] {
  return useMemo(() => {
    const values = entries(options as Record<V, string>).map(([value, label]) => ({
      value,
      label,
      isDefault: value === defaultValue,
    }));
    return sort === 'value' || sort === 'label'
      ? orderBy(values, ['isDefault', sort], ['desc', 'asc'])
      : values;
  }, [options, sort, defaultValue]);
}

const DropdownItem = memo(function DropdownItem<V extends string = string>({
  label,
  value,
  onChange,
  css: cssProp,
  DropdownItemLabelComponent = DropdownItemLabel<V>,
}: DropdownItemProps<V>) {
  const handleChange = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      e.stopPropagation();
      onChange(value);
    },
    [onChange, value]
  );

  return (
    <div onClick={handleChange} className={css(cssProp)}>
      <DropdownItemLabelComponent value={value} label={label} />
    </div>
  );
});

export const DropdownItemLabel = memo(function DropdownItemLabel<V extends string = string>({
  label,
}: DropdownItemLabelProps<V>) {
  return <>{label}</>;
});

export const SelectedItem = memo(function SelectedItem<V extends string = string>({
  value,
  options,
}: SelectedItemProps<V>) {
  return <>{options[value]}</>;
});

export const LabeledSelect = memo(function LabeledSelect<V extends string = string>({
  label,
  value,
  defaultValue = 'default',
  onChange,
  options,
  sortOptions = 'default',
  fullWidth = false,
  borderless = false,
  disabled = false,
  SelectedItemComponent = SelectedItem<V>,
  DropdownItemComponent = DropdownItem<V>,
  DropdownItemLabelComponent = DropdownItemLabel<V>,
  selectCss,
  selectCurrentCss,
  selectLabelCss,
  selectValueCss,
  selectIconCss,
  selectFullWidthCss,
  selectBorderlessCss,
  selectOpenCss,
  selectOpenIconCss,
  dropdownCss,
  dropdownItemCss,
  dropdownItemSelectedCss,
  dropdownAutoWidth = true,
  dropdownAutoHeight = true,
  dropdownAutoHide = true,
  placement = 'bottom-start',
  showArrow = true,
}: LabeledSelectProps<V>) {
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement>(null);
  const optionsList = useSortedOptions<V>(options, sortOptions, defaultValue);
  const styles = useMemo<typeof baseStyles>(
    () => ({
      ...baseStyles,
      select: css.raw(baseStyles.select, selectCss),
      selectCurrent: css.raw(baseStyles.selectCurrent, selectCurrentCss),
      selectLabel: css.raw(baseStyles.selectLabel, selectLabelCss),
      selectValue: css.raw(baseStyles.selectValue, selectValueCss),
      selectIcon: css.raw(baseStyles.selectIcon, selectIconCss),
      selectFullWidth: css.raw(baseStyles.selectFullWidth, selectFullWidthCss),
      selectBorderless: css.raw(baseStyles.selectBorderless, selectBorderlessCss),
      selectOpen: css.raw(baseStyles.selectOpen, selectOpenCss),
      selectOpenIcon: css.raw(baseStyles.selectOpenIcon, selectOpenIconCss),
      dropdown: css.raw(baseStyles.dropdown, dropdownCss),
      dropdownItem: css.raw(baseStyles.dropdownItem, dropdownItemCss),
      dropdownItemSelected: css.raw(baseStyles.dropdownItemSelected, dropdownItemSelectedCss),
    }),
    [
      selectCss,
      selectCurrentCss,
      selectLabelCss,
      selectValueCss,
      selectIconCss,
      selectFullWidthCss,
      selectBorderlessCss,
      selectOpenCss,
      selectOpenIconCss,
      dropdownCss,
      dropdownItemCss,
      dropdownItemSelectedCss,
    ]
  );

  const handleToggle = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.stopPropagation();
      setIsOpen(open => !open);
    },
    [setIsOpen]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleChange = useCallback<LabeledSelectProps<V>['onChange']>(
    value => {
      setIsOpen(false);
      onChange(value);
    },
    [setIsOpen, onChange]
  );

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown" touchEvent="onTouchStart">
      <button
        onClick={disabled ? undefined : handleToggle}
        ref={anchorEl}
        className={css(
          styles.select,
          borderless && styles.selectBorderless,
          fullWidth && styles.selectFullWidth,
          isOpen && styles.selectOpen,
          disabled && styles.selectDisabled
        )}
      >
        <div className={css(styles.selectCurrent)}>
          {label ? <div className={css(styles.selectLabel)}>{label}</div> : null}
          <div className={css(styles.selectValue)}>
            <SelectedItemComponent options={options} value={value} />
          </div>
          {showArrow && (
            <ExpandMore className={css(styles.selectIcon, isOpen && styles.selectOpenIcon)} />
          )}
        </div>
        <Floating
          open={isOpen}
          anchorEl={anchorEl}
          placement={placement}
          css={styles.dropdown}
          autoWidth={dropdownAutoWidth}
          autoHeight={dropdownAutoHeight}
          autoHide={dropdownAutoHide}
        >
          {optionsList.map(({ value: optionValue, label }) => (
            <DropdownItemComponent
              key={optionValue}
              onChange={handleChange}
              label={label}
              value={optionValue}
              DropdownItemLabelComponent={DropdownItemLabelComponent}
              css={css.raw(
                styles.dropdownItem,
                optionValue === value && styles.dropdownItemSelected
              )}
            />
          ))}
        </Floating>
      </button>
    </ClickAwayListener>
  );
});
