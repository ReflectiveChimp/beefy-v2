import { memo } from 'react';
import { useAppSelector } from '../../../store';
import { selectVaultById } from '../../../features/data/selectors/vaults';
import type { VaultEntity } from '../../../features/data/entities/vault';
import { BusdBanner } from './BusdBanner';

export type BusdBannerVaultProps = {
  vaultId: VaultEntity['id'];
};

export const BusdBannerVault = memo<BusdBannerVaultProps>(function BusdBannerVault({ vaultId }) {
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  return vault.assetIds.includes('BUSD') ? <BusdBanner /> : null;
});
