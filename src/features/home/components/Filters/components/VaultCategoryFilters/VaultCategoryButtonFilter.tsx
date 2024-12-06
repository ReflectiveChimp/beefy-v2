import { memo, useCallback, useMemo } from 'react';
import { MultiToggleButtons } from '../../../../../../components/ToggleButtons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterVaultCategory } from '../../../../../data/selectors/filtered-vaults';
import type { FilteredVaultsState } from '../../../../../data/reducers/filtered-vaults';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { CATEGORY_OPTIONS } from './category-options';
import { type CssStyles } from '@repo/styles/css';

export type VaultCategoryButtonFilterProps = {
  css?: CssStyles;
};
export const VaultCategoryButtonFilter = memo(function VaultCategoryButtonFilter({
  css: cssProp,
}: VaultCategoryButtonFilterProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allKey = 'all';
  const options: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(CATEGORY_OPTIONS)
          .filter(([key]) => key !== allKey)
          .map(([key, cat]) => [key, t(cat.i18nKey)])
      ),
    [t]
  );
  const value = useAppSelector(selectFilterVaultCategory);

  const handleChange = useCallback(
    selected => {
      dispatch(
        filteredVaultsActions.setVaultCategory(
          selected.length === Object.values(options).length
            ? []
            : (selected as FilteredVaultsState['vaultCategory'])
        )
      );
    },
    [dispatch, options]
  );

  return (
    <MultiToggleButtons
      value={value}
      options={options}
      onChange={handleChange}
      buttonsCss={cssProp}
      fullWidth={false}
      untoggleValue={allKey}
    />
  );
});
