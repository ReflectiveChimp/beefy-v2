import type { ChangeEvent, MouseEventHandler } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import type { DropdownItemProps, LabeledMultiSelectProps } from '../LabeledMultiSelect';
import {
  DropdownMultiSelectItem,
  DropdownMultiSelectItemLabel,
  SelectedMultiSelectItem,
} from '../LabeledMultiSelect';
import { Floating } from '../Floating';
import { styles } from './styles';
import { ClickAwayListener } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { css } from '@repo/styles/css';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { Search } from '../Search';
import { simplifySearchText, stringFoundAnywhere } from '../../helpers/string';
import { useTranslation } from 'react-i18next';
import { useMultiSelectSortedOptions } from '../LabeledMultiSelect/hooks';

function useFilteredSortedOptions(
  options: LabeledMultiSelectProps['options'],
  sort: LabeledMultiSelectProps['sortOptions'],
  inputText: string
) {
  const sortedValues = useMultiSelectSortedOptions(options, sort);
  return useMemo(() => {
    if (inputText.length > 2) {
      return sortedValues.filter(option => {
        if (stringFoundAnywhere(simplifySearchText(option.label), inputText)) {
          return option;
        }
      });
    }
    return sortedValues;
  }, [inputText, sortedValues]);
}

const useStyles = legacyMakeStyles(styles);

export const LabeledSearchMultiSelect = memo(function LabeledSearchMultiSelect({
  label,
  options,
  value,
  placement = 'bottom-start',
  sortOptions = 'default',
  allSelectedLabel = 'Select-AllSelected',
  countSelectedLabel = 'Select-CountSelected',
  noOptionsMessage = 'NoResults-NoResultsFound',
  SelectedItemComponent = SelectedMultiSelectItem,
  DropdownItemComponent = DropdownMultiSelectItem,
  DropdownItemLabelComponent = DropdownMultiSelectItemLabel,
  onChange,
  fullWidth = false,
  borderless = false,
  dropdownShift = true,
  dropdownFlip = true,
  dropdownAutoHide = true,
  selectCss,
}: LabeledMultiSelectProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const allKey = 'all';
  const [inputText, setInputText] = useState<string>('');
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const optionsList = useFilteredSortedOptions(options, sortOptions, inputText);
  const allSelected = value.length === Object.keys(options).length || value.length === 0;

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

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputText(event.target.value.toLocaleLowerCase());
    },
    [setInputText]
  );

  const handleClearInput = useCallback(() => {
    setInputText('');
  }, [setInputText]);

  const handleChange = useCallback<DropdownItemProps['onChange']>(
    changedValue => {
      if (changedValue === allKey) {
        onChange(Object.keys(options));
      } else {
        if (value.includes(changedValue)) {
          onChange(value.filter(v => v !== changedValue));
        } else {
          onChange([...value, changedValue]);
        }
      }
      setInputText('');
    },
    [value, options, onChange, allKey]
  );

  const handleAvoidClosePopUp = useCallback<MouseEventHandler<HTMLInputElement>>(e => {
    e.stopPropagation();
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown" touchEvent="onTouchStart">
      <div>
        <button
          onClick={handleToggle}
          ref={anchorEl}
          className={css(
            styles.select,
            selectCss,
            borderless && styles.selectBorderless,
            fullWidth && styles.selectFullWidth,
            isOpen && styles.selectOpen
          )}
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
            <ExpandMore className={css(styles.selectIcon, isOpen && styles.selectOpenIcon)} />
          </div>
        </button>
        <Floating
          open={isOpen}
          anchorEl={anchorEl}
          placement={placement}
          css={styles.dropdown}
          flip={dropdownFlip}
          shift={dropdownShift}
          autoHide={dropdownAutoHide}
        >
          <div className={classes.inputContainer}>
            <Search
              searchText={inputText}
              handleSearchText={handleInputChange}
              handleClearText={handleClearInput}
              onClick={handleAvoidClosePopUp}
            />
          </div>
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
          {inputText.length > 2 && optionsList.length === 0 && (
            <div
              aria-disabled={true}
              onClick={handleAvoidClosePopUp}
              className={classes.noResultItem}
            >
              {t(noOptionsMessage)}
            </div>
          )}
        </Floating>
      </div>
    </ClickAwayListener>
  );
});
