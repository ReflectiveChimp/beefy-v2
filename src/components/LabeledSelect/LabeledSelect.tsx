import type { FC, MouseEventHandler, ReactNode } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import { orderBy } from 'lodash-es';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import type { Placement } from '@floating-ui/react-dom';
import { entries } from '../../helpers/object';
import { styled } from '@repo/styles/jsx';
import { FloatingButtonTrigger } from '../Floating/FloatingTriggers';
import { FloatingDropdown } from '../Floating/FloatingDropdown';
import { FloatingProvider } from '../Floating/FloatingProvider';
import type { StyledVariantProps } from '@repo/styles/types';

export type LabeledSelectCommonProps<V extends string = string> = {
  label?: string;
  options: Partial<Record<V, string>>;
  placement?: Placement;
  sortOptions?: 'default' | 'value' | 'label';
  fullWidth?: boolean;
  borderless?: boolean;
  disabled?: boolean;
  selectClass?: string;
  selectCurrentClass?: string;
  selectLabelClass?: string;
  selectValueClass?: string;
  selectIconClass?: string;
  selectFullWidthClass?: string;
  selectBorderlessClass?: string;
  selectOpenClass?: string;
  dropdownClass?: string;
  dropdownItemClass?: string;
  dropdownItemSelectedClass?: string;
  dropdownAutoWidth?: boolean;
  dropdownAutoHeight?: boolean;
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
  layer?: 0 | 1 | 2;
  showArrow?: boolean;
  variant?: SelectButtonVariants['variant'];
};

type DropdownItemProps<V extends string = string> = {
  label: string;
  value: V;
  onChange: (value: V) => void;
  selected: boolean;
  DropdownItemLabelComponent?: FC<DropdownItemLabelProps<V>>;
  tabIndex?: number;
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
): { value: V; label: string; isDefault: boolean }[] {
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
  selected,
  DropdownItemLabelComponent = DropdownItemLabel<V>,
  tabIndex,
}: DropdownItemProps<V>) {
  const handleChange = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.stopPropagation();
      onChange(value);
    },
    [onChange, value]
  );

  return (
    <SelectOption onClick={handleChange} tabIndex={tabIndex ?? -1} selected={selected}>
      <DropdownItemLabelComponent value={value} label={label} />
    </SelectOption>
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
  dropdownAutoWidth = true,
  dropdownAutoHeight = true,
  placement = 'bottom-start',
  showArrow = true,
  layer = 0,
  variant = 'default',
}: LabeledSelectProps<V>) {
  const [isOpen, setIsOpen] = useState(false);
  const optionsList = useSortedOptions<V>(options, sortOptions, defaultValue);
  const handleChange = useCallback<LabeledSelectProps<V>['onChange']>(
    value => {
      setIsOpen(false);
      onChange(value);
    },
    [setIsOpen, onChange]
  );

  return (
    <FloatingProvider
      open={isOpen}
      onChange={setIsOpen}
      disabled={disabled}
      autoHeight={dropdownAutoHeight}
      autoWidth={dropdownAutoWidth}
      placement={placement}
      role="select"
      layer={layer}
    >
      <SelectButton fullWidth={fullWidth} borderless={borderless} variant={variant}>
        {label ? <SelectLabel>{label}</SelectLabel> : null}
        <SelectItem>
          <SelectedItemComponent options={options} value={value} />
        </SelectItem>
        {showArrow && <SelectArrow open={isOpen} />}
      </SelectButton>
      <SelectDropdown>
        {optionsList.map(({ value: optionValue, label }, index) => (
          <DropdownItemComponent
            key={optionValue}
            onChange={handleChange}
            label={label}
            value={optionValue}
            DropdownItemLabelComponent={DropdownItemLabelComponent}
            selected={optionValue === value}
            tabIndex={index + 1}
          />
        ))}
      </SelectDropdown>
    </FloatingProvider>
  );
});

const SelectLabel = styled('div', {
  base: {
    color: 'text.dark',
    flexShrink: '0',
    flexGrow: '0',
  },
});

const SelectItem = styled('div', {
  base: {
    flexShrink: 1,
    flexGrow: 0,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const SelectArrow = styled(ExpandMore, {
  base: {
    color: 'text.light',
    marginLeft: 'auto',
  },
  variants: {
    open: {
      true: {
        transform: 'rotateX(180deg)',
      },
    },
  },
});

type SelectButtonVariants = StyledVariantProps<typeof SelectButton>;

export const SelectButton = styled(
  FloatingButtonTrigger,
  {
    base: {
      textStyle: 'body-lg-med',
      colorPalette: 'buttons.default',
      color: 'colorPalette.color',
      backgroundColor: 'colorPalette.background',
      borderColor: 'colorPalette.border',
      borderRadius: '8px',
      textAlign: 'left',
      justifyContent: 'flex-start',
      width: 'min-content',
      gap: '4px',
    },
    variants: {
      open: {
        true: {
          color: 'text.light',
        },
      },
      borderless: {
        false: {
          borderStyle: 'solid',
          borderWidth: '2px',
          padding: '6px 14px',
        },
        true: {
          padding: '8px 16px',
        },
      },
      fullWidth: {
        false: {},
        true: {
          width: '100%',
        },
      },
      variant: {
        default: {
          colorPalette: 'buttons.default',
        },
        light: {
          colorPalette: 'buttons.light',
        },
        search: {
          backgroundColor: 'purpleDarkest',
        },
      },
    },
    defaultVariants: {
      borderless: false,
      fullWidth: false,
      open: false,
      variant: 'light',
    },
  },
  {
    defaultProps: {
      type: 'button',
    },
  }
);

const SelectDropdown = styled(FloatingDropdown, {
  base: {
    textStyle: 'body-lg-med',
    backgroundColor: 'background.contentPrimary',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'background.contentLight',
    borderRadius: '8px',
    color: 'text.middle',
    overflowX: 'hidden',
    overflowY: 'auto',
    minHeight: '100px',
  },
});

const SelectOption = styled(
  'button',
  {
    base: {
      display: 'flex',
      textAlign: 'left',
      justifyContent: 'flex-start',
      padding: '8px 14px',
      width: '100%',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&:focus-visible': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    variants: {
      selected: {
        true: {
          backgroundColor: 'transparent',
          color: 'text.light',
        },
      },
    },
  },
  {
    defaultProps: {
      type: 'button',
    },
  }
);
