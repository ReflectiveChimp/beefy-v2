import { type FC, memo, useCallback, useMemo } from 'react';
import type { ToggleButtonProps, ToggleButtonsProps } from './ToggleButtons';
import { Buttons } from './Buttons';
import { Button } from './Button';

export type MultiToggleButtonProps = Omit<ToggleButtonProps, 'onClick'> & {
  onClick: (isSelected: boolean, value: string) => void;
};

export const MultiToggleButton = memo<MultiToggleButtonProps>(function MultiToggleButton({
  value,
  label,
  onClick,
  ...rest
}) {
  const isSelected = rest.active;
  const handleClick = useCallback(() => {
    onClick(!isSelected, value);
  }, [onClick, isSelected, value]);

  return (
    <Button {...rest} onClick={handleClick}>
      {label}
    </Button>
  );
});

type MultiToggleButtonsProps = Omit<ToggleButtonsProps, 'value' | 'onChange' | 'untoggleValue'> & {
  value: string[];
  onChange: (value: string[]) => void;
  ButtonComponent: FC<MultiToggleButtonProps>;
};

export const MultiToggleButtons = memo<MultiToggleButtonsProps>(function MultiToggleButtons({
  value,
  options,
  fullWidth,
  onChange,
  variant,
  ButtonComponent = MultiToggleButton,
}) {
  const optionsList = useMemo(
    () => Object.entries(options).map(([value, label]) => ({ value, label })),
    [options]
  );

  const handleClick = useCallback(
    (isSelected: boolean, id: string) => {
      onChange(isSelected ? [...value, id] : value.filter(selectedId => selectedId !== id));
    },
    [onChange, value]
  );

  return (
    <Buttons fullWidth={fullWidth} variant={variant} noBackground={true}>
      {optionsList.map(({ value: optionValue, label }) => (
        <ButtonComponent
          key={optionValue}
          value={optionValue}
          label={label}
          active={value.includes(optionValue)}
          noBackground={true}
          onClick={handleClick}
        />
      ))}
    </Buttons>
  );
});
