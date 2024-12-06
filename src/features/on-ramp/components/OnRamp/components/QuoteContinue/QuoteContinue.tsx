import { memo, useCallback } from 'react';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { Button } from '../../../../../../components/Button';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectCanQuote, selectHaveQuote } from '../../../../../data/selectors/on-ramp';
import { QuoteBest } from '../QuoteBest';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';
import { useTranslation } from 'react-i18next';

export type QuoteContinueProps = {
  css?: CssStyles;
};
export const QuoteContinue = memo(function QuoteContinue({ css: cssProp }: QuoteContinueProps) {
  const canQuote = useAppSelector(selectCanQuote);
  const haveQuote = useAppSelector(selectHaveQuote);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleContinue = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.InjectProvider }));
  }, [dispatch]);

  return (
    <div className={css(styles.container, cssProp)}>
      {canQuote ? <QuoteBest /> : null}
      <Button
        variant="success"
        disabled={!canQuote || !haveQuote}
        fullWidth={true}
        borderless={true}
        onClick={handleContinue}
      >
        {t('OnRamp-Continue')}
      </Button>
    </div>
  );
});
