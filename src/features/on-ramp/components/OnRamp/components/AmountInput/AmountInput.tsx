import { memo, useCallback, useState } from 'react';
import { InputBase } from '@material-ui/core';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import type { InputBaseProps } from '@material-ui/core/InputBase/InputBase';

function isValidNumberInputString(value: string, maxDecimals: number): boolean {
  const regex = new RegExp(`^[0-9]*\\.?[0-9]{0,${maxDecimals}}$`);
  return !!value.match(regex);
}

function numberInputStringToNumber(value: string): number {
  const parsedText = value.replace(/[^0-9.]+/g, '').replace(/\.$/, '');
  return parseFloat(parsedText);
}

function numberToString(value: number, maxDecimals: number): string {
  if (value <= 0) {
    return '';
  }

  return value.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
    useGrouping: false,
  });
}

export type AmountInputProps = {
  maxDecimals?: number;
  value: number;
  onChange: (value: number | undefined) => void;
  error?: boolean;
  css?: CssStyles;
  endAdornment?: InputBaseProps['endAdornment'];
};
export const AmountInput = memo(function AmountInput({
  value,
  onChange,
  maxDecimals = 2,
  error = false,
  css: cssProp,
  endAdornment,
}: AmountInputProps) {
  // Initial value to string
  const [input, setInput] = useState(() => {
    return numberToString(value, maxDecimals);
  });

  const handleChange = useCallback<Exclude<InputBaseProps['onChange'], undefined>>(
    e => {
      const rawInput = e.target.value;

      // Don't let user type if invalid number input
      if (rawInput.length === 0 || isValidNumberInputString(rawInput, maxDecimals)) {
        setInput(rawInput);
      }

      // "" or "." = 0
      if (rawInput.length === 0 || rawInput === '.') {
        onChange(0);
        return;
      }

      // Convert string input to number
      const parsedNumber = numberInputStringToNumber(rawInput);

      // Check valid number
      if (isNaN(parsedNumber) || !isFinite(parsedNumber) || parsedNumber < 0) {
        setInput('');
        onChange(0);
        return;
      }

      // Raise changed event
      onChange(parsedNumber);
    },
    [setInput, maxDecimals, onChange]
  );

  const handleBlur = useCallback<Exclude<InputBaseProps['onBlur'], undefined>>(
    e => {
      const rawInput = e.target.value;

      if (rawInput.length === 0) {
        return;
      }

      if (rawInput === '.') {
        setInput('');
      } else {
        const parsedNumber = numberInputStringToNumber(rawInput);
        setInput(numberToString(parsedNumber, maxDecimals));
      }
    },
    [setInput, maxDecimals]
  );

  return (
    <InputBase
      className={css(styles.input, cssProp, error && styles.error)}
      value={input}
      onChange={handleChange}
      onBlur={handleBlur}
      fullWidth={true}
      endAdornment={endAdornment}
      placeholder={`0`}
    />
  );
});
