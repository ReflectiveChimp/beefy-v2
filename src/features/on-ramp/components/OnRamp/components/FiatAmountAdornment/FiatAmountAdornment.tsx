import { memo, useCallback } from 'react';
import { CurrencyFlag } from '../CurrencyFlag';
import { ButtonAdornment } from '../ButtonAdornment';
import { useAppDispatch } from '../../../../../../store';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';

export type FiatAmountAdornmentProps = {
  currencyCode: string;
};
export const FiatAmountAdornment = memo(function FiatAmountAdornment({
  currencyCode,
}: FiatAmountAdornmentProps) {
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectFiat }));
  }, [dispatch]);

  return (
    <ButtonAdornment onClick={handleClick}>
      <CurrencyFlag currencyCode={currencyCode} />
      {currencyCode}
    </ButtonAdornment>
  );
});
