import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterStrategyType } from '../../../../../data/selectors/filtered-vaults';
import type { ToggleButtonsProps } from '../../../../../../components/ToggleButtons';
import type { FilteredVaultsState } from '../../../../../data/reducers/filtered-vaults';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { LabeledSelect } from '../../../../../../components/LabeledSelect';
import { TYPE_OPTIONS } from './type-options';
import { type CssStyles } from '@repo/styles/css';

export type StrategyTypeDropdownFilterProps = {
  css?: CssStyles;
};
export const StrategyTypeDropdownFilter = memo(function StrategyTypeDropdownFilter({
  css: cssProp,
}: StrategyTypeDropdownFilterProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const options: Record<string, string> = useMemo(
    () => Object.fromEntries(Object.entries(TYPE_OPTIONS).map(([key, label]) => [key, t(label)])),
    [t]
  );
  const value = useAppSelector(selectFilterStrategyType);
  const handleChange = useCallback<ToggleButtonsProps['onChange']>(
    value => {
      dispatch(filteredVaultsActions.setStrategyType(value as FilteredVaultsState['strategyType']));
    },
    [dispatch]
  );

  return (
    <LabeledSelect
      label={t('Filter-Strategy')}
      value={value}
      options={options}
      onChange={handleChange}
      selectCss={cssProp}
      fullWidth={true}
    />
  );
});
