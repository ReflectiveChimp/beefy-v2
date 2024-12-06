import { memo, useCallback, useMemo } from 'react';
import type { ToggleButtonsProps } from '../../../../../../components/ToggleButtons';
import { ToggleButtons } from '../../../../../../components/ToggleButtons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterUserCategory } from '../../../../../data/selectors/filtered-vaults';
import type { FilteredVaultsState } from '../../../../../data/reducers/filtered-vaults';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { CATEGORY_OPTIONS } from './category-options';
import { type CssStyles } from '@repo/styles/css';

export type UserCategoryButtonFilterProps = {
  css?: CssStyles;
};
export const UserCategoryButtonFilter = memo(function UserCategoryButtonFilter({
  css: cssProp,
}: UserCategoryButtonFilterProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const options: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(Object.entries(CATEGORY_OPTIONS).map(([key, label]) => [key, t(label)])),
    [t]
  );
  const value = useAppSelector(selectFilterUserCategory);
  const handleChange = useCallback<ToggleButtonsProps['onChange']>(
    value => {
      dispatch(filteredVaultsActions.setUserCategory(value as FilteredVaultsState['userCategory']));
    },
    [dispatch]
  );

  return (
    <ToggleButtons value={value} options={options} onChange={handleChange} buttonsCss={cssProp} />
  );
});
