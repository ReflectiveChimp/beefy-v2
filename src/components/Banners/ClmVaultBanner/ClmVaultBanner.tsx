import { memo, useMemo } from 'react';
import { useAppSelector } from '../../../store';
import { Trans, useTranslation } from 'react-i18next';
import clmIcon from '../../../images/icons/clm.svg';
import {
  isCowcentratedGovVault,
  type VaultEntity,
  type VaultGovCowcentrated,
  type VaultStandardCowcentrated,
} from '../../../features/data/entities/vault';
import { InternalLink } from '../Links/Links';
import { selectVaultById } from '../../../features/data/selectors/vaults';
import { selectHasUserDepositInVault } from '../../../features/data/selectors/balance';
import { DismissibleBanner } from '../Banner/DismissibleBanner';

export type ClmVaultBannerProps = {
  vaultId: VaultEntity['id'];
};

export const ClmVaultBanner = memo(function ClmVaultBanner({ vaultId }: ClmVaultBannerProps) {
  const maybeClmPool = useAppSelector(state => selectVaultById(state, vaultId));

  if (!isCowcentratedGovVault(maybeClmPool) || !maybeClmPool.cowcentratedIds.vault) {
    return null;
  }

  return <ClmVaultBannerImpl pool={maybeClmPool} vaultId={maybeClmPool.cowcentratedIds.vault} />;
});

export type ClmVaultBannerImplProps = {
  pool: VaultGovCowcentrated;
  vaultId: VaultStandardCowcentrated['id'];
};

const ClmVaultBannerImpl = memo(function ClmVaultBannerImpl({
  pool,
  vaultId,
}: ClmVaultBannerImplProps) {
  const { t } = useTranslation();
  const isDeposited = useAppSelector(state => selectHasUserDepositInVault(state, pool.id));
  const components = useMemo(
    () => ({
      VaultLink: <InternalLink to={`/vault/${vaultId}`} />,
    }),
    [vaultId]
  );

  return (
    <DismissibleBanner
      id={`clm-pool-vault.${pool.id}`}
      icon={<img src={clmIcon} alt="" width={24} height={24} />}
      text={
        <Trans
          t={t}
          i18nKey={`Banner-ClmVault${isDeposited ? '-Deposited' : ''}`}
          components={components}
        />
      }
    />
  );
});
