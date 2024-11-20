import type { MouseEventHandler } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { ClickAwayListener, makeStyles } from '@material-ui/core';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import clsx from 'clsx';
import { Floating } from '../Floating';
import { styles } from './styles';
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

const useStyles = makeStyles(styles);

export const DropdownMultiSelectItem = memo(function DropdownItem<V extends string = string>({
  label,
  value,
  onChange,
  className,
  selected,
  DropdownItemLabelComponent = DropdownMultiSelectItemLabel<V>,
}: DropdownItemProps<V | 'all'>) {
  const handleChange = useCallback<LabelledCheckboxProps['onChange']>(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <LabelledCheckbox
      label={<DropdownItemLabelComponent label={label} value={value} />}
      checkboxClass={className}
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
  selectClass,
  selectCurrentClass,
  selectLabelClass,
  selectValueClass,
  selectIconClass,
  selectFullWidthClass,
  selectBorderlessClass,
  selectOpenClass,
  dropdownClass,
  dropdownItemClass,
  dropdownItemSelectedClass,
  dropdownAutoWidth = true,
  dropdownAutoHeight = true,
  dropdownAutoHide = true,
}: LabeledMultiSelectProps<V>) {
  const baseClasses = useStyles();
  const allKey = 'all';
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const optionsList = useMultiSelectSortedOptions<V>(options, sortOptions);
  const classes = useMemo<typeof baseClasses>(
    () => ({
      ...baseClasses,
      select: clsx(baseClasses.select, selectClass),
      selectCurrent: clsx(baseClasses.selectCurrent, selectCurrentClass),
      selectLabel: clsx(baseClasses.selectLabel, selectLabelClass),
      selectValue: clsx(baseClasses.selectValue, selectValueClass),
      selectIcon: clsx(baseClasses.selectIcon, selectIconClass),
      selectFullWidth: clsx(baseClasses.selectFullWidth, selectFullWidthClass),
      selectBorderless: clsx(baseClasses.selectBorderless, selectBorderlessClass),
      selectOpen: clsx(baseClasses.selectOpen, selectOpenClass),
      dropdown: clsx(baseClasses.dropdown, dropdownClass),
      dropdownItem: clsx(baseClasses.dropdownItem, dropdownItemClass),
      dropdownItemSelected: clsx(baseClasses.dropdownItemSelected, dropdownItemSelectedClass),
    }),
    [
      baseClasses,
      selectClass,
      selectCurrentClass,
      selectLabelClass,
      selectValueClass,
      selectIconClass,
      selectFullWidthClass,
      selectBorderlessClass,
      selectOpenClass,
      dropdownClass,
      dropdownItemClass,
      dropdownItemSelectedClass,
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
        className={clsx(classes.select, {
          [classes.selectBorderless]: borderless,
          [classes.selectFullWidth]: fullWidth,
          [classes.selectOpen]: isOpen,
        })}
      >
        <div className={classes.selectCurrent}>
          <div className={classes.selectLabel}>{label}</div>
          <div className={classes.selectValue}>
            <SelectedItemComponent
              value={value}
              options={options}
              allSelected={allSelected}
              allSelectedLabel={allSelectedLabel}
              countSelectedLabel={countSelectedLabel}
            />
          </div>
          <ExpandMore className={classes.selectIcon} />
        </div>
        <Floating
          open={isOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          className={classes.dropdown}
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
              className={clsx(classes.dropdownItem, {
                [classes.dropdownItemSelected]: allSelected,
              })}
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
              className={clsx(classes.dropdownItem, {
                [classes.dropdownItemSelected]: value.includes(optionValue),
              })}
            />
          ))}
        </Floating>
      </button>
    </ClickAwayListener>
  );
});
