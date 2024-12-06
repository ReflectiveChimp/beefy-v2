import { memo, useCallback, useMemo } from 'react';
import {
  selectUserIsUnstakedForVaultId,
  selectUserUnstakedClms,
} from '../../../features/data/selectors/balance';
import { useAppDispatch, useAppSelector } from '../../../store';
import { Banner, type BannerProps } from '../Banner';
import { Trans, useTranslation } from 'react-i18next';
import clmIcon from '../../../images/icons/clm.svg';
import {
  isCowcentratedLikeVault,
  isCowcentratedVault,
  type VaultCowcentratedLike,
  type VaultEntity,
} from '../../../features/data/entities/vault';
import { ButtonLink, InternalLink } from '../Links/Links';
import { filteredVaultsActions } from '../../../features/data/reducers/filtered-vaults';
import { selectTokenByAddress } from '../../../features/data/selectors/tokens';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { selectVaultById } from '../../../features/data/selectors/vaults';
import { ClmVaultBanner } from '../ClmVaultBanner/ClmVaultBanner';
import { useHistory } from 'react-router-dom';
import { Container } from '../../Container/Container';
import { css } from '@repo/styles/css';

const variant: BannerProps['variant'] = 'warning';

const useStyles = legacyMakeStyles({
  clmUnstakedBannerContainer: css.raw({
    backgroundColor: 'background.header',
  }),
});

export const UnstakedClmBanner = memo(function UnstakedClmBanner() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { push } = useHistory();
  const unstakedIds = useAppSelector(selectUserUnstakedClms);
  const handleFilter = useCallback(() => {
    dispatch(filteredVaultsActions.reset());
    dispatch(filteredVaultsActions.setUserCategory('deposited'));
    dispatch(
      filteredVaultsActions.setBoolean({
        filter: 'onlyUnstakedClm',
        value: true,
      })
    );
    push('/');
  }, [dispatch, push]);

  if (!unstakedIds.length) {
    return null;
  }

  if (unstakedIds.length === 1) {
    return <UnstakedClmBannerVault vaultId={unstakedIds[0]} />;
  }

  return (
    <Banner
      variant={variant}
      icon={<img src={clmIcon} alt="" />}
      text={
        <Trans
          t={t}
          i18nKey={`Banner-UnstakedClm`}
          values={{ count: unstakedIds.length }}
          components={{
            Link: <ButtonLink onClick={handleFilter} />,
          }}
        />
      }
    />
  );
});

export type UnstakedClmBannerVaultProps = {
  vaultId: VaultEntity['id'];
  fromVault?: boolean;
};

export const UnstakedClmBannerVault = memo(function UnstakedClmBannerVault({
  vaultId,
  fromVault,
}: UnstakedClmBannerVaultProps) {
  const shouldStake = useAppSelector(state => selectUserIsUnstakedForVaultId(state, vaultId));
  const vault = useAppSelector(state => selectVaultById(state, vaultId));

  if (!isCowcentratedLikeVault(vault)) {
    return null;
  }

  if (shouldStake) {
    return <UnstakedClmBannerVaultImpl vault={vault} fromVault={fromVault || false} />;
  }

  if (fromVault) {
    return <ClmVaultBanner vaultId={vaultId} />;
  }

  return null;
});

export type UnstakedClmBannerVaultImplProps = {
  vault: VaultCowcentratedLike;
  fromVault: boolean;
};

const UnstakedClmBannerVaultImpl = memo(function UnstakedClmBannerVaultImpl({
  vault,
  fromVault,
}: UnstakedClmBannerVaultImplProps) {
  const { t } = useTranslation();
  const depositToken = useAppSelector(state =>
    selectTokenByAddress(
      state,
      vault.chainId,
      isCowcentratedVault(vault) ? vault.contractAddress : vault.depositTokenAddress
    )
  );
  const availableTypes =
    vault.cowcentratedIds.pool && vault.cowcentratedIds.vault
      ? 'both'
      : vault.cowcentratedIds.pool
      ? 'gov'
      : 'standard';
  const thisType = vault.type;
  const endOfKey = !fromVault
    ? `link-${availableTypes}`
    : `this-${thisType}${availableTypes === 'both' ? '-both' : ''}`;

  const components = useMemo(() => {
    return {
      GovLink: vault.cowcentratedIds.pool ? (
        <InternalLink to={`/vault/${vault.cowcentratedIds.pool}`} />
      ) : (
        <span />
      ),
      VaultLink: vault.cowcentratedIds.vault ? (
        <InternalLink to={`/vault/${vault.cowcentratedIds.vault}`} />
      ) : (
        <span />
      ),
    };
  }, [vault.cowcentratedIds.pool, vault.cowcentratedIds.vault]);

  return (
    <Banner
      variant={variant}
      icon={<img src={clmIcon} alt="" width={24} height={24} />}
      text={
        <Trans
          t={t}
          i18nKey={`Banner-UnstakedClm-${endOfKey}`}
          values={{ token: depositToken.symbol }}
          components={components}
        />
      }
    />
  );
});

interface UnstakedClmBannerDashboardProps {
  address: string;
}

export const UnstakedClmBannerDashboard = memo(function UnstakedClmBannerDashboard({
  address,
}: UnstakedClmBannerDashboardProps) {
  const classes = useStyles();
  const unstakedIds = useAppSelector(state => selectUserUnstakedClms(state, address));

  if (!unstakedIds.length) {
    return null;
  }

  return (
    <div className={classes.clmUnstakedBannerContainer}>
      <Container maxWidth="lg">
        <UnstakedClmBanner />
      </Container>
    </div>
  );
});
