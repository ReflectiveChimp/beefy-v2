import { memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectFiat,
  selectFiatTokenMinMaxFiat,
  selectInputAmount,
  selectInputError,
  selectNetwork,
  selectOutputAmount,
  selectToken,
} from '../../../../../data/selectors/on-ramp';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { AmountInput } from '../AmountInput';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { FiatAmountAdornment } from '../FiatAmountAdornment';
import { AmountOutput } from '../AmountOutput';
import { AmountLabel } from '../AmountLabel';
import { useTranslation } from 'react-i18next';
import { InputError } from '../../../../../data/reducers/on-ramp-types';
import { css, type CssStyles } from '@repo/styles/css';

const useStyles = legacyMakeStyles(styles);

type OutOfRangeErrorProps = {
  currency: string;
  min: number;
  max: number;
};
const OutOfRangeError = memo(function OutOfRangeError({
  currency,
  min,
  max,
}: OutOfRangeErrorProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const key = 'OnRamp-' + (max === Number.MAX_VALUE ? 'RangeErrorMin' : 'RangeErrorMinMax');

  return (
    <div className={classes.error}>
      {t(key, {
        min: min.toFixed(2),
        max: max.toFixed(2),
        currency,
      })}
    </div>
  );
});

type FiatAmountInputProps = {
  fiat: string;
};
const FiatAmountInput = memo(function FiatAmountInput({ fiat }: FiatAmountInputProps) {
  const dispatch = useAppDispatch();

  const inputValue = useAppSelector(selectInputAmount);
  const token = useAppSelector(selectToken);
  const network = useAppSelector(selectNetwork);
  const error = useAppSelector(selectInputError);
  const range = useAppSelector(state => selectFiatTokenMinMaxFiat(state, fiat, token, network));
  const handleValueChange = useCallback(
    (value: number) => {
      dispatch(onRampFormActions.setInputAmount({ amount: value }));
    },
    [dispatch]
  );

  return (
    <>
      <AmountInput
        value={inputValue}
        onChange={handleValueChange}
        maxDecimals={2}
        error={error === InputError.OutOfRange}
        endAdornment={<FiatAmountAdornment currencyCode={fiat} />}
      />
      {error === InputError.OutOfRange ? (
        <OutOfRangeError currency={fiat} min={range.min} max={range.max} />
      ) : null}
    </>
  );
});

type FiatAmountOutputProps = {
  fiat: string;
};
const FiatAmountOutput = memo(function FiatAmountOutput({ fiat }: FiatAmountOutputProps) {
  const outputValue = useAppSelector(selectOutputAmount);

  return (
    <AmountOutput
      value={outputValue}
      maxDecimals={2}
      endAdornment={<FiatAmountAdornment currencyCode={fiat} />}
    />
  );
});

export type FiatAmountProps = {
  isInput: boolean;
  css?: CssStyles;
};
export const FiatAmount = memo(function FiatAmount({ isInput, css: cssProp }: FiatAmountProps) {
  const { t } = useTranslation();
  const fiat = useAppSelector(selectFiat);

  return (
    <div className={css(cssProp)}>
      <AmountLabel css={styles.label}>{t('OnRamp-YouPay')}</AmountLabel>
      {isInput ? <FiatAmountInput fiat={fiat} /> : <FiatAmountOutput fiat={fiat} />}
    </div>
  );
});
