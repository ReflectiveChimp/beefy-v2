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
import { styles } from './styles';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { type CssStyles } from '@repo/styles/css';

const useStyles = legacyMakeStyles(styles);

export type AssetTypeButtonFilterProps = {
  css?: CssStyles;
};

const CategoryToggleButton = memo(function CategoryToggleButton(props: MultiToggleButtonProps) {
  const classes = useStyles();
  const { value, label: originalLabel, onClick } = props;
  const label = useMemo(() => {
    const option = TYPE_OPTIONS[value];
    if (option && option.highlight) {
      return (
        <>
          {originalLabel} <span className={classes.highlight}>{option.highlight}</span>
        </>
      );
    }
    return originalLabel;
  }, [value, originalLabel, classes]);

  const handleClick = (isSelected: boolean, value: string) => {
    onClick(isSelected, value);
  };

  return <MultiToggleButton {...props} label={label} onClick={handleClick} />;
});

export const AssetTypeButtonFilter = memo(function AssetTypeButtonFilter({
  css: cssProp,
}: AssetTypeButtonFilterProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allKey = 'all';
  const options: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TYPE_OPTIONS)
          .filter(([key]) => key !== allKey)
          .map(([key, cat]) => [key, t(cat.i18nKey)])
      ),
    [t]
  );
  const value = useAppSelector(selectFilterAssetType);

  const handleChange = useCallback(
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
    <MultiToggleButtons
      value={value}
      options={options}
      onChange={handleChange}
      buttonsCss={cssProp}
      fullWidth={false}
      untoggleValue={allKey}
      ButtonComponent={CategoryToggleButton}
    />
  );
});
