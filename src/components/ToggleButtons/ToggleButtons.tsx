import type { FC, ReactNode } from 'react';
import { memo, useCallback, useMemo } from 'react';
import { styles as baseStyles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { ExtraOptionsList } from './components/ExtraOptionsList';

export type ToggleButtonProps = {
  value: string;
  label: ReactNode;
  onClick: (value: string) => void;
  css?: CssStyles;
};

export type ToggleButtonsProps = {
  value: string;
  options: Record<string, string>;
  extraOptions?: Record<string, string>;
  fullWidth?: boolean;
  buttonsCss?: CssStyles;
  buttonCss?: CssStyles;
  selectedCss?: CssStyles;
  untogglableCss?: CssStyles;
  onChange: (value: string) => void;
  ButtonComponent?: FC<ToggleButtonProps>;
  /** set this to 'all' key */
  untoggleValue?: string;
};

export const ToggleButton = memo(function ToggleButton({
  value,
  label,
  onClick,
  css: cssProp,
}: ToggleButtonProps) {
  const handleClick = useCallback(() => {
    onClick(value);
  }, [value, onClick]);

  return (
    <button className={css(cssProp)} onClick={handleClick}>
      {label}
    </button>
  );
});

export const ToggleButtons = memo(function ToggleButtons({
  value,
  options,
  extraOptions,
  fullWidth,
  buttonsCss,
  buttonCss,
  selectedCss,
  untogglableCss,
  onChange,
  ButtonComponent = ToggleButton,
  untoggleValue,
}: ToggleButtonsProps) {
  const optionsList = useMemo(
    () => Object.entries(options).map(([value, label]) => ({ value, label })),
    [options]
  );

  const handleClick = useCallback(
    newValue => {
      if (untoggleValue) {
        onChange(newValue === value ? untoggleValue : newValue);
      } else {
        onChange(newValue);
      }
    },
    [onChange, untoggleValue, value]
  );

  return (
    <div
      className={css(
        baseStyles.buttons,
        buttonsCss,
        fullWidth && baseStyles.fullWidth,
        untoggleValue !== undefined && css.raw(baseStyles.untogglable, untogglableCss)
      )}
    >
      {optionsList.map(({ value: optionValue, label }) => (
        <ButtonComponent
          key={optionValue}
          value={optionValue}
          label={label}
          onClick={handleClick}
          css={css.raw(
            baseStyles.button,
            buttonCss,
            value === optionValue && css.raw(baseStyles.selected, selectedCss),
            untoggleValue !== undefined && baseStyles.untogglableButton
          )}
        />
      ))}
      {extraOptions && (
        <ExtraOptionsList
          ButtonComponent={ButtonComponent}
          extraOptions={extraOptions}
          onClick={handleClick}
          value={value}
          buttonCss={buttonCss}
          selectedCss={selectedCss}
        />
      )}
    </div>
  );
});

export type MultiToggleButtonProps = Omit<ToggleButtonProps, 'onClick'> & {
  isSelected: boolean;
  onClick: (isSelected: boolean, value: string) => void;
};

export const MultiToggleButton = memo(function ToggleButton({
  value,
  label,
  onClick,
  isSelected,
  css: cssProp,
}: MultiToggleButtonProps) {
  const handleClick = useCallback(() => {
    onClick(!isSelected, value);
  }, [onClick, isSelected, value]);

  return (
    <button className={css(cssProp)} onClick={handleClick} data-selected={isSelected}>
      {label}
    </button>
  );
});

type MultiToggleButtonsProps = Omit<
  ToggleButtonsProps,
  'value' | 'extraOptions' | 'onChange' | 'ButtonComponent'
> & {
  value: string[];
  onChange: (value: string[]) => void;
  ButtonComponent?: FC<MultiToggleButtonProps>;
};

export const MultiToggleButtons = memo(function MultiToggleButtons({
  value,
  options,
  fullWidth,
  buttonsCss,
  buttonCss,
  selectedCss,
  untogglableCss,
  onChange,
  ButtonComponent = MultiToggleButton,
  untoggleValue,
}: MultiToggleButtonsProps) {
  const optionsList = useMemo(
    () => Object.entries(options).map(([value, label]) => ({ value, label })),
    [options]
  );

  const handleClick = useCallback(
    (isSelected, id) => {
      onChange(isSelected ? [...value, id] : value.filter(selectedId => selectedId !== id));
    },
    [onChange, value]
  );

  return (
    <div
      className={css(
        baseStyles.buttons,
        buttonsCss,
        fullWidth && baseStyles.fullWidth,
        untoggleValue !== undefined && css.raw(baseStyles.untogglable, untogglableCss)
      )}
    >
      {optionsList.map(({ value: optionValue, label }) => (
        <ButtonComponent
          key={optionValue}
          value={optionValue}
          label={label}
          isSelected={value.includes(optionValue)}
          onClick={handleClick}
          css={css.raw(
            baseStyles.button,
            buttonCss,
            value.includes(optionValue) && css.raw(baseStyles.selected, selectedCss),
            untoggleValue !== undefined && baseStyles.untogglableButton
          )}
        />
      ))}
    </div>
  );
});
