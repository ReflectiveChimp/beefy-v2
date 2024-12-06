import { memo, useCallback } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { Step } from '../../../../../../components/Step';
import { useTranslation } from 'react-i18next';
import { onRampFormActions } from '../../../../../data/reducers/on-ramp';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectQuoteByProvider,
  selectSortedQuoteProviders,
} from '../../../../../data/selectors/on-ramp';
import { useDispatch } from 'react-redux';
import { SearchableList } from '../../../../../../components/SearchableList';
import type { ItemInnerProps } from '../../../../../../components/SearchableList/ItemInner';
import { FormStep } from '../../../../../data/reducers/on-ramp-types';
import { ProviderIcon } from '../ProviderIcon';
import { PROVIDERS } from '../../providers';

const useStyles = legacyMakeStyles(styles);

export const SelectProviderStep = memo(function SelectProviderStep() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const handleBack = useCallback(() => {
    dispatch(onRampFormActions.setStep({ step: FormStep.InputAmount }));
  }, [dispatch]);

  return (
    <Step stepType="onRamp" title={t('OnRamp-SelectProviderStep-Title')} onBack={handleBack}>
      <ProviderSelector />
    </Step>
  );
});

const ListItem = memo(function ListItem({ value }: ItemInnerProps) {
  const classes = useStyles();
  const quote = useAppSelector(state => selectQuoteByProvider(state, value));

  return (
    <>
      <ProviderIcon provider={quote.provider} css={styles.icon} />
      <div className={classes.provider}>{PROVIDERS[quote.provider].title}</div>
      <div className={classes.rate}>
        1 {quote.token} = {(1 / quote.rate).toFixed(2)} {quote.fiat}
      </div>
    </>
  );
});

const ProviderSelector = memo(function ProviderSelector() {
  const providers = useAppSelector(selectSortedQuoteProviders);
  const dispatch = useDispatch();

  const handleSelect = useCallback(
    (provider: string) => {
      dispatch(onRampFormActions.selectProvider({ provider }));
    },
    [dispatch]
  );

  return (
    <>
      <SearchableList options={providers} onSelect={handleSelect} ItemInnerComponent={ListItem} />
    </>
  );
});
