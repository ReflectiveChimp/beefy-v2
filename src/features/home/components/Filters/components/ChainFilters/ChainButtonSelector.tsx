import { memo, useCallback } from 'react';
import type { ChainEntity } from '../../../../../data/entities/chain';
import { selectActiveChainIds } from '../../../../../data/selectors/chains';
import { useAppSelector } from '../../../../../../store';
import { styled } from '@repo/styles/jsx';
import { ChainButton } from './ChainButton';

export type ChainButtonSelectorProps = {
  selected: ChainEntity['id'][];
  onChange: (selected: ChainEntity['id'][]) => void;
};

export const ChainButtonSelector = memo<ChainButtonSelectorProps>(function ChainButtonSelector({
  selected,
  onChange,
}) {
  const chainIds = useAppSelector(selectActiveChainIds);
  const handleChange = useCallback(
    (isSelected: boolean, id: ChainEntity['id']) => {
      if (isSelected) {
        if (!selected.includes(id)) {
          const newSelected = [...selected, id];
          // if all selected, return empty array to represent not-filtered
          onChange(newSelected.length < chainIds.length ? newSelected : []);
        }
      } else if (!isSelected) {
        if (selected.length === 0) {
          // special handling:
          // first chain unselected should be treated as unselecting all other chains instead
          onChange([id]);
        } else if (selected.includes(id)) {
          onChange(selected.filter(selectedId => selectedId !== id));
        }
      }
    },
    [chainIds, selected, onChange]
  );

  return (
    <Buttons>
      {chainIds.map(id => (
        <ChainButton
          key={id}
          id={id}
          selected={selected.length === 0 || selected.includes(id)}
          onChange={handleChange}
        />
      ))}
    </Buttons>
  );
});

const Buttons = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    columnGap: '0',
    rowGap: '16px',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'background.contentPrimary',
    borderRadius: '8px',
    backgroundColor: 'background.contentDark',
  },
});
