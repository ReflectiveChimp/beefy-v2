import { memo, useCallback, useMemo } from 'react';
import {
  MultiToggleButton,
  type MultiToggleButtonProps,
  MultiToggleButtons,
} from '../../../../../../components/ToggleButtons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterAssetType } from '../../../../../data/selectors/filtered-vaults';
import type { FilteredVaultsState } from '../../../../../data/reducers/filtered-vaults';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { TYPE_OPTIONS } from './type-options';
import { Highlight } from './Highlight';

export const AssetTypeButtonFilter = memo(function AssetTypeButtonFilter() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const options: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(Object.entries(TYPE_OPTIONS).map(([key, cat]) => [key, t(cat.i18nKey)])),
    [t]
  );
  const value = useAppSelector(selectFilterAssetType);

  const handleChange = useCallback(
    (selected: string[]) => {
      dispatch(
        filteredVaultsActions.setAssetType(
          selected.length === Object.values(options).length
            ? []
            : (selected as FilteredVaultsState['assetType'])
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
      fullWidth={false}
      ButtonComponent={CategoryToggleButton}
      variant="filter"
    />
  );
});

const CategoryToggleButton = memo<MultiToggleButtonProps>(function CategoryToggleButton(props) {
  const { value, label: originalLabel } = props;
  const label = useMemo(() => {
    const option = TYPE_OPTIONS[value];
    if (option && option.highlight) {
      return (
        <>
          {originalLabel} <Highlight>{option.highlight}</Highlight>
        </>
      );
    }
    return originalLabel;
  }, [value, originalLabel]);

  return <MultiToggleButton {...props} label={label} />;
});
