import { memo, useCallback } from 'react';
import { styles } from './styles';
import { Step } from '../../../../../../components/Step';
import { useTranslation } from 'react-i18next';
import { InputSwitcher } from '../InputSwitcher';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectInputMode } from '../../../../../data/selectors/on-ramp';
import { FiatAmount } from '../FiatAmount';
import { TokenAmount } from '../TokenAmount';
import { QuoteContinue } from '../QuoteContinue';
import { FormStep, InputMode } from '../../../../../data/reducers/on-ramp-types';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';

export const AmountStep = memo(function AmountStep() {
  const { t } = useTranslation();
  const inputMode = useAppSelector(selectInputMode);

  const dispatch = useAppDispatch();

  const handleBack = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.SelectNetwork }));
  }, [dispatch]);

  return (
    <Step
      stepType="onRamp"
      title={t('OnRamp-AmountStep-Title')}
      contentCss={styles.container}
      onBack={handleBack}
    >
      <FiatAmount
        isInput={inputMode === InputMode.Fiat}
        css={inputMode === InputMode.Fiat ? styles.input : styles.output}
      />
      <InputSwitcher css={styles.switcher} />
      <TokenAmount
        isInput={inputMode === InputMode.Token}
        css={inputMode === InputMode.Token ? styles.input : styles.output}
      />
      <QuoteContinue css={styles.continue} />
    </Step>
  );
});
