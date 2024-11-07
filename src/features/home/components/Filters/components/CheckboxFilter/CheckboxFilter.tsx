import type { FilteredVaultBooleanKeys } from '../../../../../data/reducers/filtered-vaults';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterBoolean } from '../../../../../data/selectors/filtered-vaults';
import type { LabelledCheckboxProps } from '../../../../../../components/LabelledCheckbox';
import { LabelledCheckbox } from '../../../../../../components/LabelledCheckbox';

export type CheckboxFilterProps = {
  filter: FilteredVaultBooleanKeys;
  label: string;
  icon?: ReactNode;
};

export const CheckboxFilter = memo<CheckboxFilterProps>(function CheckboxFilter({
  filter,
  label,
  icon,
}) {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => selectFilterBoolean(state, filter));
  const handleChange = useCallback<LabelledCheckboxProps['onChange']>(
    checked => {
      dispatch(filteredVaultsActions.setBoolean({ filter, value: checked }));
    },
    [dispatch, filter]
  );

  return (
    <LabelledCheckbox
      label={
        <>
          {icon ? <div>{icon}</div> : null}
          {label}
        </>
      }
      onChange={handleChange}
      checked={value}
      variant="dark"
    />
  );
});
