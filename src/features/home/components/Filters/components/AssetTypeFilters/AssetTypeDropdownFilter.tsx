import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterAssetType } from '../../../../../data/selectors/filtered-vaults';
import {
  filteredVaultsActions,
  type FilteredVaultsState,
} from '../../../../../data/reducers/filtered-vaults';
import { TYPE_OPTIONS } from './type-options';
import {
  DropdownItemLabel,
  type DropdownItemLabelProps,
} from '../../../../../../components/LabeledSelect';
import {
  LabeledMultiSelect,
  type LabeledMultiSelectProps,
} from '../../../../../../components/LabeledMultiSelect';
import { Highlight, HighlightHolder } from './Highlight';

const CategoryDropdownLabel = memo<DropdownItemLabelProps>(function CategoryDropdownLabel(props) {
  const { value, label: originalLabel } = props;
  const label = useMemo(() => {
    const option = TYPE_OPTIONS[value];
    if (option && option.highlight) {
      return (
        <HighlightHolder>
          {originalLabel} <Highlight>{option.highlight}</Highlight>
        </HighlightHolder>
      );
    }
    return originalLabel;
  }, [value, originalLabel]);

  return <DropdownItemLabel {...props} label={label} />;
});

export type AssetTypeDropdownFilterProps = {
  className?: string;
};
export const AssetTypeDropdownFilter = memo<AssetTypeDropdownFilterProps>(
  function AssetTypeDropdownFilter({ className }) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const options: Record<string, string> = useMemo(
      () =>
        Object.fromEntries(Object.entries(TYPE_OPTIONS).map(([key, cat]) => [key, t(cat.i18nKey)])),
      [t]
    );
    const value = useAppSelector(selectFilterAssetType);

    const handleChange = useCallback<LabeledMultiSelectProps['onChange']>(
      selected => {
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
      <LabeledMultiSelect
        label={t('Filter-Type')}
        value={value}
        options={options}
        onChange={handleChange}
        selectClass={className}
        fullWidth={true}
        DropdownItemLabelComponent={CategoryDropdownLabel}
      />
    );
  }
);
