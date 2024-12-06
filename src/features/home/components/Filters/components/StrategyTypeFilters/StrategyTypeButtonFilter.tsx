import { memo, useCallback, useMemo } from 'react';
import type { ToggleButtonsProps } from '../../../../../../components/ToggleButtons';
import { ToggleButtons } from '../../../../../../components/ToggleButtons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterStrategyType } from '../../../../../data/selectors/filtered-vaults';
import type { FilteredVaultsState } from '../../../../../data/reducers/filtered-vaults';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { TYPE_OPTIONS } from './type-options';
import { type CssStyles } from '@repo/styles/css';

export type StrategyTypeButtonFilterProps = {
  css?: CssStyles;
};
export const StrategyTypeButtonFilter = memo(function StrategyTypeButtonFilter({
  css: cssProp,
}: StrategyTypeButtonFilterProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allKey = 'all';
  const options: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TYPE_OPTIONS)
          .filter(([key]) => key !== allKey)
          .map(([key, label]) => [key, t(label)])
      ),
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
    <ToggleButtons
      value={value}
      options={options}
      onChange={handleChange}
      buttonsCss={cssProp}
      fullWidth={false}
      untoggleValue={allKey}
    />
  );
});
