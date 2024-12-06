import type { MouseEventHandler } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { ClickAwayListener } from '@material-ui/core';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { css } from '@repo/styles/css';
import { Floating } from '../Floating';
import { styles as baseStyles } from './styles';
import { useTranslation } from 'react-i18next';
import type { LabelledCheckboxProps } from '../LabelledCheckbox';
import { LabelledCheckbox } from '../LabelledCheckbox';
import { keys } from '../../helpers/object';
import type {
  DropdownItemLabelProps,
  DropdownItemProps,
  LabeledMultiSelectProps,
  SelectedItemProps,
} from './types';
import { useMultiSelectSortedOptions } from './hooks';

export const DropdownMultiSelectItem = memo(function DropdownItem<V extends string = string>({
  label,
  value,
  onChange,
  css: cssProp,
  selected,
  DropdownItemLabelComponent = DropdownMultiSelectItemLabel<V>,
}: DropdownItemProps<V | 'all'>) {
  const handleChange = useCallback<LabelledCheckboxProps['onChange']>(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <LabelledCheckbox
      label={<DropdownItemLabelComponent label={label} value={value} />}
      checkboxCss={cssProp}
      onChange={handleChange}
      checked={selected}
    />
  );
});

export const DropdownMultiSelectItemLabel = memo(function DropdownItemLabel<
  V extends string = string
>({ label }: DropdownItemLabelProps<V>) {
  return <>{label}</>;
});

export const SelectedMultiSelectItem = memo(function SelectedMultiSelectItem<
  V extends string = string
>({ value, options, allSelected, allSelectedLabel, countSelectedLabel }: SelectedItemProps<V>) {
  const { t } = useTranslation();
  let message: string;

  if (allSelected) {
    message = t(allSelectedLabel ?? 'Select-AllSelected');
  } else if (value.length === 1) {
    const key = value[0];
    message = options[key]!;
  } else {
    message = t(countSelectedLabel ?? 'Select-CountSelected', { count: value.length });
  }

  return <>{message}</>;
});

export const LabeledMultiSelect = memo(function LabeledMultiSelect<V extends string = string>({
  label,
  value,
  allLabel,
  allSelectedLabel = 'Select-AllSelected',
  countSelectedLabel = 'Select-CountSelected',
  onChange,
  options,
  sortOptions = 'default',
  fullWidth = false,
  borderless = false,
  SelectedItemComponent = SelectedMultiSelectItem<V>,
  DropdownItemComponent = DropdownMultiSelectItem<V>,
  DropdownItemLabelComponent = DropdownMultiSelectItemLabel<V>,
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
}: LabeledMultiSelectProps<V>) {
  const allKey = 'all';
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const optionsList = useMultiSelectSortedOptions<V>(options, sortOptions);
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
  const allOptionEnabled = !!allLabel;
  const allSelected = value.length === optionsList.length || value.length === 0;

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

  const handleChange = useCallback(
    (changedValue: V | 'all') => {
      if (changedValue === allKey) {
        onChange(keys(options));
      } else {
        if (value.includes(changedValue)) {
          onChange(value.filter(v => v !== changedValue));
        } else {
          onChange([...value, changedValue]);
        }
      }
    },
    [value, options, onChange, allKey]
  );

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown" touchEvent="onTouchStart">
      <button
        onClick={handleToggle}
        ref={anchorEl}
        className={css(
          styles.select,
          borderless && styles.selectBorderless,
          fullWidth && styles.selectFullWidth,
          isOpen && styles.selectOpen
        )}
      >
        <div className={css(styles.selectCurrent)}>
          <div className={css(styles.selectLabel)}>{label}</div>
          <div className={css(styles.selectValue)}>
            <SelectedItemComponent
              value={value}
              options={options}
              allSelected={allSelected}
              allSelectedLabel={allSelectedLabel}
              countSelectedLabel={countSelectedLabel}
            />
          </div>
          <ExpandMore className={css(styles.selectIcon, isOpen && styles.selectOpenIcon)} />
        </div>
        <Floating
          open={isOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          css={styles.dropdown}
          autoWidth={dropdownAutoWidth}
          autoHeight={dropdownAutoHeight}
          autoHide={dropdownAutoHide}
        >
          {allOptionEnabled ? (
            <DropdownItemComponent
              onChange={handleChange}
              label={allLabel}
              value={allKey}
              selected={allSelected}
              DropdownItemLabelComponent={DropdownItemLabelComponent}
              css={css.raw(styles.dropdownItem, allSelected && styles.dropdownItemSelected)}
            />
          ) : null}
          {optionsList.map(({ value: optionValue, label }) => (
            <DropdownItemComponent
              key={optionValue}
              onChange={handleChange}
              label={label}
              value={optionValue}
              selected={value.includes(optionValue)}
              DropdownItemLabelComponent={DropdownItemLabelComponent}
              css={css.raw(
                styles.dropdownItem,
                value.includes(optionValue) && styles.dropdownItemSelected
              )}
            />
          ))}
        </Floating>
      </button>
    </ClickAwayListener>
  );
});
