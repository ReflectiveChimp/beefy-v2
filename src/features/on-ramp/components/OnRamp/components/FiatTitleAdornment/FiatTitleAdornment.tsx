import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { CurrencyFlag } from '../CurrencyFlag';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';
import { useAppDispatch } from '../../../../../../store';

const useStyles = legacyMakeStyles(styles);

export type FiatTitleAdornmentProps = {
  currencyCode: string;
  css?: CssStyles;
};
export const FiatTitleAdornment = memo(function TokenIconAdornment({
  currencyCode,
  css: cssProp,
}: FiatTitleAdornmentProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectFiat }));
  }, [dispatch]);

  return (
    <button className={css(styles.fiatAdornment, cssProp)} onClick={handleClick}>
      <CurrencyFlag currencyCode={currencyCode} className={classes.flag} />
      {currencyCode}
    </button>
  );
});
