import type { ReactNode } from 'react';
import { memo, useCallback, useMemo } from 'react';
import { Button, type ButtonVariantProps } from './Button';
import { Buttons, type ButtonsVariantProps } from './Buttons';

export type ToggleButtonsProps = {
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
  /** set this to 'all' key */
  untoggleValue?: string;
  noPadding?: boolean;
} & ButtonsVariantProps;

export const ToggleButtons = memo<ToggleButtonsProps>(function ToggleButtons({
  value,
  options,
  fullWidth,
  onChange,
  untoggleValue,
  variant,
  noBackground,
  noPadding = false,
}) {
  const canUntoggle = untoggleValue !== undefined;
  const optionsList = useMemo(
    () => Object.entries(options).map(([value, label]) => ({ value, label })),
    [options]
  );

  const handleClick = useCallback(
    (newValue: string) => {
      if (untoggleValue) {
        onChange(newValue === value ? untoggleValue : newValue);
      } else {
        onChange(newValue);
      }
    },
    [onChange, untoggleValue, value]
  );

  return (
    <Buttons fullWidth={fullWidth} variant={variant} noBackground={noBackground ?? canUntoggle}>
      {optionsList.map(({ value: optionValue, label }) => (
        <ToggleButton
          key={optionValue}
          value={optionValue}
          label={label}
          onClick={handleClick}
          active={value === optionValue}
          noBackground={noBackground ?? canUntoggle}
          noPadding={noPadding}
          unselectable={!canUntoggle && value === optionValue}
        />
      ))}
    </Buttons>
  );
});

export type ToggleButtonProps = {
  value: string;
  label: ReactNode;
  onClick: (value: string) => void;
} & ButtonVariantProps;

export const ToggleButton = memo<ToggleButtonProps>(function ToggleButton({
  value,
  label,
  onClick,
  ...rest
}) {
  const handleClick = useCallback(() => {
    onClick(value);
  }, [value, onClick]);

  return (
    <Button {...rest} onClick={handleClick}>
      {label}
    </Button>
  );
});
