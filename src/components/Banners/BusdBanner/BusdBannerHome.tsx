import { memo } from 'react';
import { useAppSelector } from '../../../store';
import { selectUserDepositedVaultIdsForAsset } from '../../../features/data/selectors/balance';
import { BusdBanner } from './BusdBanner';

export const BusdBannerHome = memo(function BusdBannerHome() {
  const vaultIds = useAppSelector(state => selectUserDepositedVaultIdsForAsset(state, 'BUSD'));
  return vaultIds.length ? <BusdBanner /> : null;
});
