import { memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { selectFilterChainIds } from '../../../../../data/selectors/filtered-vaults';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { filteredVaultsActions } from '../../../../../data/reducers/filtered-vaults';
import { ChainButtonSelector } from './ChainButtonSelector';
import type { CssStyles } from '@repo/styles/css';

export type ChainButtonFilterProps = {
  css?: CssStyles;
};

export const ChainButtonFilter = memo(function ChainButtonFilter({
  css: cssProp,
}: ChainButtonFilterProps) {
  const dispatch = useAppDispatch();
  const selectedChainIds = useAppSelector(selectFilterChainIds);

  const handleChainSelectorChange = useCallback(
    (selected: ChainEntity['id'][]) => {
      dispatch(filteredVaultsActions.setChainIds(selected));
    },
    [dispatch]
  );

  return (
    <ChainButtonSelector
      selected={selectedChainIds}
      onChange={handleChainSelectorChange}
      css={cssProp}
    />
  );
});
