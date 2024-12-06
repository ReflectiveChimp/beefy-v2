import { memo, useMemo } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { VaultTag, VaultTagWithTooltip } from './VaultTag';
import { useTranslation } from 'react-i18next';
import type { BoostEntity } from '../../../../features/data/entities/boost';
import { useAppSelector } from '../../../../store';
import {
  selectBoostById,
  selectOffchainBoostCampaignByType,
  selectPreStakeOrActiveBoostIds,
} from '../../../../features/data/selectors/boosts';
import { useIsOverflowingHorizontally } from '../../../../helpers/overflow';
import { BasicTooltipContent } from '../../../Tooltip/BasicTooltipContent';
import type { ChainEntity } from '../../../../features/data/entities/chain';
import type { TokenEntity } from '../../../../features/data/entities/token';
import { selectTokenByAddress } from '../../../../features/data/selectors/tokens';
import {
  isCowcentratedGovVault,
  isCowcentratedLikeVault,
  isCowcentratedStandardVault,
  isCowcentratedVault,
  isGovVault,
  isVaultActive,
  isVaultEarningPoints,
  isVaultPaused,
  isVaultRetired,
  type VaultCowcentrated,
  type VaultCowcentratedLike,
  type VaultEntity,
  type VaultGovCowcentrated,
  type VaultStandardCowcentrated,
} from '../../../../features/data/entities/vault';
import { VaultPlatform } from '../../../VaultPlatform';
import {
  selectCowcentratedVaultById,
  selectVaultById,
} from '../../../../features/data/selectors/vaults';
import { getBoostIconSrc } from '../../../../helpers/boostIconSrc';
import { css, type CssStyles } from '@repo/styles/css';
import { getIcon } from '../../../../helpers/iconSrc';
import { selectPlatformById } from '../../../../features/data/selectors/platforms';
import {
  selectVaultActiveMerklBoostCampaigns,
  selectVaultHasActiveMerklBoostCampaigns,
} from '../../../../features/data/selectors/rewards';
import { useBreakpoint } from '../../../MediaQueries/useBreakpoint';

const useStyles = legacyMakeStyles(styles);

type VaultBoostTagProps = {
  boostId: BoostEntity['id'];
  onlyIcon?: boolean;
};
const VaultBoostTag = memo(function VaultBoostTag({ boostId, onlyIcon }: VaultBoostTagProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const boost = useAppSelector(state => selectBoostById(state, boostId));
  const { isOverflowing, ref } = useIsOverflowingHorizontally();
  const { tagIcon, tagText, name } = boost;
  const iconSrc = useMemo(() => (tagIcon ? getBoostIconSrc(tagIcon) : undefined), [tagIcon]);

  return (
    <VaultTagWithTooltip
      content={<BasicTooltipContent title={t('VaultTag-PartnerBoost', { partner: name })} />}
      placement="bottom"
      disabled={!isOverflowing && !onlyIcon}
      css={styles.vaultTagBoost}
      ref={ref}
      icon={
        iconSrc ? (
          <img src={iconSrc} alt="" className={classes.vaultTagBoostIcon} width={12} height={12} />
        ) : (
          <>{'\uD83D\uDD25'}</>
        )
      }
      text={!onlyIcon ? tagText ?? t('VaultTag-PartnerBoost', { partner: name }) : null}
    />
  );
});

export const VaultMerklBoostTag = memo(function VaultMerklBoostTag({
  vaultId,
  onlyIcon,
}: {
  vaultId: VaultEntity['id'];
  onlyIcon?: boolean;
}) {
  const classes = useStyles();
  const { isOverflowing, ref } = useIsOverflowingHorizontally();
  const activeCampaigns = useAppSelector(state =>
    selectVaultActiveMerklBoostCampaigns(state, vaultId)
  );
  const campaign = useAppSelector(state =>
    selectOffchainBoostCampaignByType(state, activeCampaigns?.[0]?.type)
  );

  if (activeCampaigns && campaign) {
    const { tagText, tagIcon, title } = campaign;

    return (
      <VaultTagWithTooltip
        content={<BasicTooltipContent title={tagText || title} />}
        placement="bottom"
        disabled={!isOverflowing && !onlyIcon}
        css={styles.vaultTagBoost}
        ref={ref}
        icon={
          tagIcon ? (
            <img
              src={getBoostIconSrc(tagIcon)}
              alt=""
              className={classes.vaultTagBoostIcon}
              width={12}
              height={12}
            />
          ) : (
            <>{'\uD83D\uDD25'}</>
          )
        }
        text={!onlyIcon ? tagText : undefined}
      />
    );
  }
  return null;
});

type VaultEarnTagProps = {
  chainId: ChainEntity['id'];
  earnedTokenAddress: TokenEntity['address'];
};
const VaultEarnTag = memo(function VaultEarnTag({
  chainId,
  earnedTokenAddress,
}: VaultEarnTagProps) {
  const { t } = useTranslation();
  const earnedToken = useAppSelector(state =>
    selectTokenByAddress(state, chainId, earnedTokenAddress)
  );

  return (
    <VaultTag
      css={styles.vaultTagEarn}
      text={t('VaultTag-EarnToken', { token: earnedToken.symbol })}
    />
  );
});

type VaultPlatformTagProps = {
  vaultId: VaultEntity['id'];
};
const VaultPlatformTag = memo(function VaultPlatformTag({ vaultId }: VaultPlatformTagProps) {
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const isGov = isGovVault(vault);
  const isCowcentratedLike = isCowcentratedLikeVault(vault);

  return (
    <VaultTag
      css={css.raw(isGov && styles.platformTagGov, isCowcentratedLike && styles.platformTagClm)}
      text={<VaultPlatform vaultId={vaultId} />}
    />
  );
});

const BaseVaultClmTag = memo(function BaseVaultClmTag({
  label,
  longLabel,
  fee,
  platformName,
  hideLabel,
  hideFee,
  css: cssProp,
  onlyIcon,
}: {
  label: string;
  longLabel: string;
  fee: string;
  platformName: string;
  hideLabel?: boolean;
  hideFee?: boolean;
  css?: CssStyles;
  onlyIcon?: boolean;
}) {
  const classes = useStyles();
  // const tooltipTitle = useMemo(() => {
  //   return fee ? `${longLabel} | ${fee}` : longLabel;
  // }, [longLabel, fee]);

  return (
    <VaultTagWithTooltip
      content={
        <BasicTooltipContent title={longLabel} content={`${platformName} trading fee: ${fee}`} />
      }
      placement="bottom"
      triggerCss={cssProp}
      css={css.raw(styles.vaultTagClm)}
      icon={
        <img
          src={getIcon('clm')}
          height={16}
          width={16}
          className={classes.vaultTagClmIcon}
          alt={hideLabel ? label : undefined}
        />
      }
      text={
        !onlyIcon && (!hideLabel || (!hideFee && fee)) ? (
          <>
            {!hideLabel && (
              <div
                className={css(
                  styles.vaultTagClmText,
                  hideFee === undefined && hideLabel === undefined && styles.vaultTagClmTextAutoHide
                )}
              >
                {label}
              </div>
            )}
            {!hideFee && fee && (
              <>
                <div className={classes.divider} />
                <span>{fee}</span>
              </>
            )}
          </>
        ) : undefined
      }
    />
  );
});

const VaultClmPoolOrVaultTag = memo(function VaultClmPoolTag({
  vault,
  hideFee,
  hideLabel,
  css: cssProp,
  isPool,
  onlyIcon,
}: {
  vault: VaultGovCowcentrated | VaultStandardCowcentrated;
  isPool?: boolean;
  hideFee?: boolean;
  hideLabel?: boolean;
  css?: CssStyles;
  onlyIcon?: boolean;
}) {
  const cowcentratedVault = useAppSelector(state =>
    selectCowcentratedVaultById(state, vault.cowcentratedIds.clm)
  );
  const depositToken = useAppSelector(state =>
    selectTokenByAddress(state, cowcentratedVault.chainId, cowcentratedVault.depositTokenAddress)
  );
  const provider = useAppSelector(state =>
    depositToken?.providerId ? selectPlatformById(state, depositToken.providerId) : undefined
  );

  const typeLabel = isPool ? 'Pool' : 'Vault';

  const hasDynamicFee = cowcentratedVault?.feeTier === 'Dynamic';
  return (
    <BaseVaultClmTag
      label={`CLM ${typeLabel}`}
      fee={hasDynamicFee ? cowcentratedVault.feeTier : `${cowcentratedVault.feeTier}%`}
      longLabel={`Cowcentrated Liquidity Manager ${typeLabel}`}
      platformName={provider?.name || 'LP'}
      hideFee={hideFee}
      hideLabel={hideLabel}
      css={cssProp}
      onlyIcon={onlyIcon}
    />
  );
});

const VaultClmTag = memo(function VaultClmTag({
  vault,
  hideFee,
  hideLabel,
  css: cssProp,
  onlyIcon,
}: {
  vault: VaultCowcentrated;
  hideFee?: boolean;
  hideLabel?: boolean;
  css?: CssStyles;
  onlyIcon?: boolean;
}) {
  const hasDynamicFee = vault.feeTier === 'Dynamic';
  const depositToken = useAppSelector(state =>
    selectTokenByAddress(state, vault.chainId, vault.depositTokenAddress)
  );
  const provider = useAppSelector(state =>
    depositToken.providerId ? selectPlatformById(state, depositToken.providerId) : undefined
  );

  return (
    <BaseVaultClmTag
      label={'CLM'}
      fee={hasDynamicFee ? vault.feeTier : `${vault.feeTier}%`}
      longLabel={'Cowcentrated Liquidity Manager'}
      platformName={provider?.name || 'LP'}
      hideFee={hideFee || hasDynamicFee}
      hideLabel={hideLabel}
      css={cssProp}
      onlyIcon={onlyIcon}
    />
  );
});

export const VaultClmLikeTag = memo(function VaultClmLikeTag({
  vault,
  hideFee,
  hideLabel,
  css: cssProp,
  onlyIcon,
}: {
  vault: VaultCowcentratedLike;
  hideFee?: boolean;
  hideLabel?: boolean;
  css?: CssStyles;
  onlyIcon?: boolean;
}) {
  if (isCowcentratedGovVault(vault)) {
    return (
      <VaultClmPoolOrVaultTag
        isPool={true}
        vault={vault}
        hideFee={true}
        hideLabel={hideLabel}
        css={cssProp}
        onlyIcon={onlyIcon}
      />
    );
  } else if (isCowcentratedStandardVault(vault)) {
    return (
      <VaultClmPoolOrVaultTag
        vault={vault}
        hideFee={true}
        hideLabel={hideLabel}
        css={cssProp}
        onlyIcon={onlyIcon}
      />
    );
  } else if (isCowcentratedVault(vault)) {
    return (
      <VaultClmTag
        vault={vault}
        hideFee={hideFee}
        hideLabel={hideLabel}
        css={cssProp}
        onlyIcon={onlyIcon}
      />
    );
  }

  return null;
});

const PointsTag = memo(function PointsTag() {
  const { t } = useTranslation();
  const { isOverflowing, ref } = useIsOverflowingHorizontally();
  return (
    <VaultTagWithTooltip
      content={<BasicTooltipContent title={t('VaultTag-Points')} />}
      placement="bottom"
      disabled={!isOverflowing}
      css={styles.vaultTagPoints}
      ref={ref}
      text={t('VaultTag-Points')}
    />
  );
});

export type VaultTagsProps = {
  vaultId: VaultEntity['id'];
};
export const VaultTags = memo(function VaultTags({ vaultId }: VaultTagsProps) {
  const { t } = useTranslation();
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const boostIds = useAppSelector(state => selectPreStakeOrActiveBoostIds(state, vaultId));
  const boostId = boostIds.length ? boostIds[0] : null;
  const isMobile = useBreakpoint({ to: 'xs' });
  const isGov = isGovVault(vault);
  const isCowcentratedLike = isCowcentratedLikeVault(vault);
  const hasBaseActiveMerklCampaigns = useAppSelector(state =>
    selectVaultHasActiveMerklBoostCampaigns(state, vaultId)
  );

  const isSmallDevice = useMediaQuery('(max-width: 450px)', { noSsr: true });

  const isClmAndBoostedAndSmallDevice =
    isSmallDevice && isCowcentratedLike && (!!boostId || hasBaseActiveMerklCampaigns);

  // Tag 1: Platform
  // Tag 2: CLM -> CLM Pool -> none
  // Tag 3: Retired -> Paused -> Boosted > Pool -> none
  // Tag 4: Points -> none
  return (
    <div className={css(styles.vaultTags)}>
      <VaultPlatformTag vaultId={vaultId} />
      {isCowcentratedLike && (
        <VaultClmLikeTag
          vault={vault}
          hideFee={isMobile || !isVaultActive(vault)}
          hideLabel={isMobile}
          onlyIcon={isClmAndBoostedAndSmallDevice}
        />
      )}
      {isVaultRetired(vault) ? (
        <VaultTag css={styles.vaultTagRetired} text={t('VaultTag-Retired')} />
      ) : isVaultPaused(vault) ? (
        <VaultTag css={styles.vaultTagPaused} text={t('VaultTag-Paused')} />
      ) : boostId ? (
        <VaultBoostTag onlyIcon={isClmAndBoostedAndSmallDevice} boostId={boostId} />
      ) : hasBaseActiveMerklCampaigns ? (
        <VaultMerklBoostTag onlyIcon={isClmAndBoostedAndSmallDevice} vaultId={vaultId} />
      ) : isGov && !isCowcentratedLike ? (
        <VaultEarnTag chainId={vault.chainId} earnedTokenAddress={vault.earnedTokenAddresses[0]} /> // TODO support multiple earned tokens [empty = ok, not used when clm-like]
      ) : null}
      {isVaultEarningPoints(vault) && <PointsTag />}
    </div>
  );
});
