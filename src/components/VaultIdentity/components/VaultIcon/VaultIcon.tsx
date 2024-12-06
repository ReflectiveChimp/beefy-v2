import { memo } from 'react';
import { styles } from './styles';
import type { VaultEntity } from '../../../../features/data/entities/vault';
import { useAppSelector } from '../../../../store';
import { selectVaultById } from '../../../../features/data/selectors/vaults';
import { AssetsImage } from '../../../AssetsImage';
import { selectVaultTokenSymbols } from '../../../../features/data/selectors/tokens';

export type VaultIconProps = {
  vaultId: VaultEntity['id'];
};
export const VaultIcon = memo(function VaultIcon({ vaultId }: VaultIconProps) {
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const vaultTokenSymbols = useAppSelector(state => selectVaultTokenSymbols(state, vault.id));

  return (
    <AssetsImage css={styles.vaultIcon} assetSymbols={vaultTokenSymbols} chainId={vault.chainId} />
  );
});
