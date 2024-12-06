import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { CurrencyFlag } from '../CurrencyFlag';
import { ButtonAdornment } from '../ButtonAdornment';
import { useAppDispatch } from '../../../../../../store';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';

const useStyles = legacyMakeStyles(styles);

export type FiatAmountAdornmentProps = {
  currencyCode: string;
  css?: CssStyles;
};
export const FiatAmountAdornment = memo(function FiatAmountAdornment({
  currencyCode,
  css: cssProp,
}: FiatAmountAdornmentProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectFiat }));
  }, [dispatch]);

  return (
    <ButtonAdornment css={css.raw(styles.button, cssProp)} onClick={handleClick}>
      <CurrencyFlag currencyCode={currencyCode} className={classes.flag} />
      {currencyCode}
    </ButtonAdornment>
  );
});
