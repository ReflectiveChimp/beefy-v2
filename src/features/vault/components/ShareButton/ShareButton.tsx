import { ReactComponent as ShareSvg } from '@repo/images/icons/mui/Share.svg';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import twitterIcon from '../../../../images/icons/share/twitter.svg';
import lensterIcon from '../../../../images/icons/share/lenster.svg';
import telegramIcon from '../../../../images/icons/share/telegram.svg';
import linkIcon from '../../../../images/icons/share/link.svg';
import {
  isCowcentratedVault,
  isGovVault,
  isGovVaultCowcentrated,
} from '../../../data/entities/vault';
import { useAppSelector } from '../../../../store';
import { selectVaultById } from '../../../data/selectors/vaults';
import { selectChainById } from '../../../data/selectors/chains';
import { selectTokenByAddress } from '../../../data/selectors/tokens';
import { selectVaultTotalApy } from '../../../data/selectors/apy';
import { formatLargePercent } from '../../../../helpers/format';
import type { BeefyState } from '../../../../redux-types';
import {
  selectBoostById,
  selectBoostPartnerById,
  selectPreStakeOrActiveBoostIds,
} from '../../../data/selectors/boosts';
import type {
  BoostedVaultExtraDetails,
  CommonExtraDetails,
  CommonVaultDetails,
  GovVaultExtraDetails,
  ShareButtonProps,
  ShareItemProps,
  ShareServiceItemProps,
  VaultDetails,
} from './types';
import { styled } from '@repo/styles/jsx';
import { buttonRecipe } from '../../../../components/Button/styles';
import { FloatingTrigger } from '../../../../components/Floating/FloatingTrigger';
import { FloatingDropdown } from '../../../../components/Floating/FloatingDropdown';
import { FloatingProvider } from '../../../../components/Floating/FloatingProvider';

export const ShareButton = memo<ShareButtonProps>(function ShareButton({
  vaultId,
  placement,
  mobileAlternative = false,
  hideText = false,
}) {
  const { t } = useTranslation();
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const chain = useAppSelector(state => selectChainById(state, vault.chainId));
  const apys = useAppSelector(state => selectVaultTotalApy(state, vault.id));
  const commonVaultDetails = useMemo<CommonVaultDetails>(() => {
    return {
      vaultName: vault.names.singleMeta,
      vaultApy: formatLargePercent(apys.totalApy, 2),
      vaultUrl: `https://app.beefy.com/vault/${vault.id}`,
      chainName: chain.name,
      chainTag: '#' + chain.name.toLowerCase().replace(/[^a-z0-9-_]/gi, ''),
      beefyHandle: '@beefyfinance',
    };
  }, [vault, chain, apys]);
  const additionalSelector = useMemo(
    () =>
      (state: BeefyState): CommonExtraDetails | BoostedVaultExtraDetails | GovVaultExtraDetails => {
        if (isCowcentratedVault(vault)) {
          return { kind: 'clm' };
        }

        if (isGovVault(vault)) {
          if (isGovVaultCowcentrated(vault)) {
            return { kind: 'clm-pool' };
          }
          const token = selectTokenByAddress(state, vault.chainId, vault.earnedTokenAddresses[0]); // TODO: handle multiple earned tokens [empty = ok, not used when clm-like]
          return {
            kind: 'gov',
            earnToken: token.symbol,
            earnTokenTag: '$' + token.symbol.replace(/[^a-z0-9-_]/gi, ''),
          };
        }

        const boostIds = selectPreStakeOrActiveBoostIds(state, vault.id);
        if (boostIds.length && apys.boostApr && apys.boostApr > 0) {
          const boost = selectBoostById(state, boostIds[0]);
          if (boost && boost.partnerIds.length) {
            const mainPartner = selectBoostPartnerById(state, boost.partnerIds[0]);
            const boostToken = selectTokenByAddress(state, boost.chainId, boost.earnedTokenAddress);
            const partnerTag = '#' + boost.name.toLowerCase().replace(' ', '');
            let partnerHandle;
            if (mainPartner.social?.twitter) {
              partnerHandle =
                '@' +
                mainPartner.social.twitter
                  .replace(/https?:\/\/(www\.)?twitter\.com/gi, '')
                  .replace('@', '')
                  .replace('/', '');
            }
            const partnerHandleOrTag = partnerHandle || partnerTag;

            return {
              kind: 'boosted',
              vaultApy: formatLargePercent(apys.boostedTotalApy, 2),
              boostToken: boostToken.symbol,
              boostTokenTag: '$' + boostToken.symbol.replace(/[^a-z0-9-_]/gi, ''),
              partnerName: boost.name,
              partnerHandle,
              partnerTag,
              partnerHandleOrTag,
            };
          }
        }

        return {
          kind: 'normal',
        };
      },
    [vault, apys]
  );
  const additionalVaultDetails = useAppSelector(additionalSelector);
  const vaultDetails: VaultDetails = useMemo(
    () => ({ ...commonVaultDetails, ...additionalVaultDetails }),
    [commonVaultDetails, additionalVaultDetails]
  );

  return (
    <FloatingProvider placement={placement || 'bottom-end'}>
      <TriggerButton mobile={mobileAlternative} borderless={true}>
        {!hideText && <ShareText mobile={mobileAlternative}>{t('Vault-Share')}</ShareText>}
        <ShareIcon />
      </TriggerButton>
      <DropdownItems>
        <TwitterItem details={vaultDetails} />
        <LensterItem details={vaultDetails} />
        <TelegramItem details={vaultDetails} />
        <CopyLinkItem details={vaultDetails} />
      </DropdownItems>
    </FloatingProvider>
  );
});

const ShareIcon = styled(ShareSvg, {
  base: {
    flexShrink: 0,
    flexGrow: 0,
    fontSize: '16px',
  },
});

const ShareText = styled('span', {
  variants: {
    mobile: {
      true: {
        mdDown: {
          display: 'none',
        },
      },
    },
  },
});

const TriggerButton = styled(
  styled(FloatingTrigger, buttonRecipe),
  {
    base: {
      display: 'flex',
      gap: '8px',
    },
    variants: {
      mobile: {
        true: {
          mdDown: {
            padding: '10px',
          },
        },
      },
    },
  },
  { defaultProps: { borderless: true, fullWidth: true } }
);

const DropdownItems = styled(FloatingDropdown, {
  base: {
    zIndex: 'dropdown',
    width: 'auto',
    maxWidth: 'calc(100vw - 32px)',
    backgroundColor: 'background.contentPrimary',
    borderRadius: '8px',
    boxShadow: '0px 4px 24px 24px rgba(19, 17, 34, 0.16), 0px 2px 8px rgba(20, 18, 33, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
  },
});

const TwitterItem = memo<ShareServiceItemProps>(function TwitterItem({ details }) {
  const { t } = useTranslation();
  const onClick = useCallback(() => {
    const message = t(`Vault-Share-Message-${details.kind}`, details);

    // https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
    const params = new URLSearchParams({
      text: message,
      url: details.vaultUrl,
    });

    window.open(`https://twitter.com/intent/tweet?${params}`, '_blank');
  }, [details, t]);

  return <ShareItem text={t('Vault-Share-Twitter')} onClick={onClick} icon={twitterIcon} />;
});

const LensterItem = memo<ShareServiceItemProps>(function LensterItem({ details }) {
  const { t } = useTranslation();
  const onClick = useCallback(() => {
    const message = t(`Vault-Share-Message-${details.kind}`, details);

    // https://docs.lens.xyz/docs/integrating-lens
    const params = new URLSearchParams({
      text: message,
      url: details.vaultUrl,
    });

    window.open(`https://lenster.xyz/?${params}`, '_blank');
  }, [details, t]);

  return <ShareItem text={t('Vault-Share-Lenster')} onClick={onClick} icon={lensterIcon} />;
});

const TelegramItem = memo<ShareServiceItemProps>(function TelegramItem({ details }) {
  const { t } = useTranslation();
  const onClick = useCallback(() => {
    const message = t(`Vault-Share-Message-${details.kind}`, details);

    // https://core.telegram.org/widgets/share
    const params = new URLSearchParams({
      text: message,
      url: details.vaultUrl,
    });

    window.open(`https://t.me/share/url?${params}`, '_blank');
  }, [details, t]);

  return <ShareItem text={t('Vault-Share-Telegram')} onClick={onClick} icon={telegramIcon} />;
});

const CopyLinkItem = memo<ShareServiceItemProps>(function CopyLinkItem({ details }) {
  const { t } = useTranslation();
  const onClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(details.vaultUrl);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  }, [details]);

  return <ShareItem text={t('Vault-Share-CopyLink')} onClick={onClick} icon={linkIcon} />;
});

const ShareItem = memo<ShareItemProps>(function ShareItem({ text, icon, onClick }) {
  return (
    <ItemButton onClick={onClick}>
      <img src={icon} width={24} height={24} alt="" aria-hidden={true} /> {text}
    </ItemButton>
  );
});

const ItemButton = styled('button', {
  base: {
    display: 'flex',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    textAlign: 'left',
    gap: '8px',
  },
});
