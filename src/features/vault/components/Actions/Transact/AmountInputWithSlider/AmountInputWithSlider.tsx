import {
  type ChangeEventHandler,
  type CSSProperties,
  memo,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { AmountInput, type AmountInputProps } from '../AmountInput/AmountInput';
import { BIG_ZERO } from '../../../../../../helpers/big-number';
import { selectTransactForceSelection } from '../../../../../data/selectors/transact';
import { useAppSelector } from '../../../../../../store';
import { css } from '@repo/styles/css';
import { styles } from './styles';
import { legacyMakeStyles } from '@repo/helpers/mui';
import type { TokenEntity } from '../../../../../data/entities/token';

type AmountInputWithSliderProps = AmountInputProps & {
  selectedToken: Pick<TokenEntity, 'decimals'>;
  endAdornment: ReactNode;
  warning?: boolean;
};

const useStyles = legacyMakeStyles(styles);

export const AmountInputWithSlider = memo(function AmountInputWithSlider({
  value,
  maxValue,
  onChange,
  selectedToken,
  css: cssProp,
  price,
  endAdornment,
  warning,
}: AmountInputWithSliderProps) {
  const forceSelection = useAppSelector(selectTransactForceSelection);
  const classes = useStyles();
  const sliderValue = useMemo(() => {
    return value
      .times(100)
      .dividedBy(maxValue.gt(BIG_ZERO) ? maxValue : 1)
      .toNumber();
  }, [maxValue, value]);
  const error = useMemo(() => {
    return value.gt(maxValue);
  }, [maxValue, value]);

  const handlePercentChange = useCallback<(v: number) => void>(
    value => {
      const isMax = value === 100;
      onChange(isMax ? maxValue : maxValue.multipliedBy(value / 100), isMax);
    },
    [maxValue, onChange]
  );

  const handleSliderChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      handlePercentChange(parseInt(e.target.value) || 0);
    },
    [handlePercentChange]
  );

  const handleButtonClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      handlePercentChange(parseInt(e.currentTarget.value) || 0);
    },
    [handlePercentChange]
  );

  return (
    <div className={css(styles.inputContainer)}>
      <AmountInput
        css={css.raw(styles.input, cssProp)}
        errorCss={styles.errorInput}
        warningCss={styles.warningInput}
        value={value}
        maxValue={maxValue}
        tokenDecimals={selectedToken.decimals}
        onChange={onChange}
        error={error}
        allowInputAboveBalance={true}
        fullWidth={true}
        price={price}
        endAdornment={endAdornment}
        disabled={forceSelection}
        warning={warning}
      />
      <input
        disabled={forceSelection}
        className={css(
          styles.slider,
          (!error || !warning) && styles.sliderBackground,
          error && styles.errorRange,
          warning && !error && styles.warningRange
        )}
        style={{ '--value': `${sliderValue}%` } as CSSProperties}
        onChange={handleSliderChange}
        value={sliderValue}
        type="range"
        min="0"
        max="100"
      />
      <div className={classes.dataList}>
        {[0, 25, 50, 75, 100].map(item => (
          <button
            className={css(
              styles.itemList,
              item === sliderValue && !error && styles.active,
              forceSelection && styles.itemDisabled
            )}
            value={item}
            onClick={handleButtonClick}
            key={`index-${item}`}
            disabled={forceSelection}
          >{`${item}%`}</button>
        ))}
      </div>
    </div>
  );
});
