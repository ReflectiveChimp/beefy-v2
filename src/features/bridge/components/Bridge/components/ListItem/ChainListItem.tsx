import { memo } from 'react';
import type { ItemInnerProps } from '../../../../../../components/SearchableList/ItemInner';
import { useAppSelector } from '../../../../../../store';
import { selectChainById } from '../../../../../data/selectors/chains';
import { ChainIcon } from '../ChainIcon';
import { styles } from './styles';
import type { ChainEntity } from '../../../../../data/entities/chain';

export const ChainListItem = memo(function ChainListItem({
  value,
}: ItemInnerProps<ChainEntity['id']>) {
  const chain = useAppSelector(state => selectChainById(state, value));

  return (
    <>
      <ChainIcon chainId={value} css={styles.listItemIcon} />
      {chain.name}
    </>
  );
});
