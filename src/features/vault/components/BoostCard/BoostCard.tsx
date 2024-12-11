import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkButton } from '../../../../components/LinkButton';
import { Card, CardContent, CardHeader } from '../Card';
import { styles } from './styles';
import type { VaultEntity } from '../../../data/entities/vault';
import {
  selectBoostActiveRewardTokens,
  selectBoostById,
  selectBoostCampaignById,
  selectBoostPartnerById,
  selectOffchainBoostCampaignByType,
  selectPreStakeOrActiveBoostIds,
} from '../../../data/selectors/boosts';
import { useAppSelector } from '../../../../store';
import { LinkIcon } from '../../../../components/LinkIcon';
import Twitter from '../../../../images/icons/twitter.svg';
import Telegram from '../../../../images/icons/telegram.svg';
import Discord from '../../../../images/icons/discord.svg';
import { RewardTokenDetails } from '../RewardTokenDetails';
import type { BoostEntity } from '../../../data/entities/boost';
import type { TokenEntity } from '../../../data/entities/token';
import { ReactComponent as Link } from '@repo/images/icons/mui/Link.svg';
import type { BoostSocials } from '../../../data/apis/config-types';
import {
  selectVaultActiveMerklBoostCampaigns,
  selectVaultHasActiveMerklBoostCampaigns,
} from '../../../data/selectors/rewards';
import { selectTokenByAddress } from '../../../data/selectors/tokens';

const useStyles = legacyMakeStyles(styles);

export type BoostCardProps = {
  vaultId: VaultEntity['id'];
};

export const BoostCard = memo(function BoostCard({ vaultId }: BoostCardProps) {
  const hasBaseActiveMerklCampaigns = useAppSelector(state =>
    selectVaultHasActiveMerklBoostCampaigns(state, vaultId)
  );

  return hasBaseActiveMerklCampaigns ? (
    <MerklBoostCard vaultId={vaultId} />
  ) : (
    <NormalBoostCard vaultId={vaultId} />
  );
});

export const MerklBoostCard = memo(function MerklBoostCard({ vaultId }: BoostCardProps) {
  const activeCampaigns = useAppSelector(state =>
    selectVaultActiveMerklBoostCampaigns(state, vaultId)
  );

  const campaign = useAppSelector(state =>
    selectOffchainBoostCampaignByType(state, activeCampaigns?.[0]?.type)
  );

  const rewardToken = useAppSelector(
    state =>
      (activeCampaigns &&
        selectTokenByAddress(
          state,
          activeCampaigns[0].rewardToken.chainId,
          activeCampaigns[0].rewardToken.address
        )) ||
      undefined
  );

  if (activeCampaigns && rewardToken && campaign) {
    const { title, description, social, learn } = campaign;
    return (
      <CampaignContent
        name={'Beefy'}
        title={title}
        learn={learn}
        description={description}
        social={social}
        rewardTokens={[rewardToken]}
        partnerIds={['optimism']}
      />
    );
  }

  return null;
});

export const NormalBoostCard = memo(function BoostCard({ vaultId }: BoostCardProps) {
  const boostIds = useAppSelector(state => selectPreStakeOrActiveBoostIds(state, vaultId));
  const boost = useAppSelector(state => selectBoostById(state, boostIds[0]));
  const rewardTokens = useAppSelector(state => selectBoostActiveRewardTokens(state, boost.id));
  const BoostComponent = boost.campaignId ? CampaignBoostCard : PartnerBoostCard;

  return <BoostComponent boost={boost} rewardTokens={rewardTokens} />;
});

interface CampaignContentProps {
  name: string;
  title: string;
  description: string;
  learn: string;
  social: BoostSocials;
  rewardTokens: TokenEntity[];
  partnerIds?: string[];
}

const CampaignContent = memo(function CampaignContent({
  name,
  title,
  description,
  learn,
  social,
  rewardTokens,
  partnerIds,
}: CampaignContentProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <h2 className={classes.boostedBy}>
          {t('Vault-BoostedBy')}
          <span>{name}</span>
        </h2>
        <div className={classes.socials}>
          {learn && <LinkButton href={learn} text={t('Boost-learn-more')} />}
          {social.twitter && <LinkIcon alt="twitter" logo={Twitter} href={social.twitter} />}
          {social.telegram && <LinkIcon alt="telegram" logo={Telegram} href={social.telegram} />}
          {social.discord && <LinkIcon alt="discord" logo={Discord} href={social.discord} />}
        </div>
      </CardHeader>
      <CardContent css={{ gap: '16px' }}>
        <div className={classes.campaignTitle}>{title}</div>
        <div className={classes.campaignText}>{description}</div>
        {partnerIds && partnerIds.length > 0 && (
          <div className={classes.partners}>
            {partnerIds.map(partnerId => (
              <PartnerSubCard key={partnerId} partnerId={partnerId} />
            ))}
          </div>
        )}
        {rewardTokens.map(rewardToken => (
          <RewardTokenDetails
            key={rewardToken.address}
            token={rewardToken}
            chainId={rewardToken.chainId}
          />
        ))}
      </CardContent>
    </Card>
  );
});

type InnerBoostCardProps = {
  boost: BoostEntity;
  rewardTokens: TokenEntity[];
};

const CampaignBoostCard = memo(function CampaignBoostCard({
  boost,
  rewardTokens,
}: InnerBoostCardProps) {
  const { title, description, learn, social } = useAppSelector(state =>
    selectBoostCampaignById(state, boost.campaignId || '')
  );

  return (
    <CampaignContent
      name={boost.name}
      title={title}
      description={description}
      learn={learn}
      social={social}
      rewardTokens={rewardTokens}
      partnerIds={boost.partnerIds}
    />
  );
});

type PartnerSubCardProps = {
  partnerId: string;
};

const PartnerSubCard = memo(function PartnerSubCard({ partnerId }: PartnerSubCardProps) {
  const classes = useStyles();
  const { title, text, website, social } = useAppSelector(state =>
    selectBoostPartnerById(state, partnerId)
  );
  return (
    <div className={classes.partnerSubCard}>
      <div className={classes.partnerHeader}>
        <h4 className={classes.partnerTitle}>{title}</h4>
        <div className={classes.socials}>
          {website && <LinkIcon alt="website" href={website} logo={Link} />}
          {social.twitter && <LinkIcon alt="twitter" logo={Twitter} href={social.twitter} />}
          {social.telegram && <LinkIcon alt="telegram" logo={Telegram} href={social.telegram} />}
          {social.discord && <LinkIcon alt="discord" logo={Discord} href={social.discord} />}
        </div>
      </div>
      <div className={classes.partnerContent}>
        <div className={classes.partnerText}>{text}</div>
      </div>
    </div>
  );
});

const PartnerBoostCard = memo(function PartnerBoostCard({
  boost,
  rewardTokens,
}: InnerBoostCardProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { text, social, website } = useAppSelector(state =>
    selectBoostPartnerById(state, boost.partnerIds[0])
  );

  return (
    <Card>
      <CardHeader>
        <h2 className={classes.boostedBy}>
          {t('Vault-BoostedBy')}
          <span>{boost.name}</span>
        </h2>
        <div className={classes.socials}>
          {website && <LinkButton href={website} text={t('Boost-PartnerLink-website')} />}
          {social.twitter && <LinkIcon alt="twitter" logo={Twitter} href={social.twitter} />}
          {social.telegram && <LinkIcon alt="telegram" logo={Telegram} href={social.telegram} />}
          {social.discord && <LinkIcon alt="discord" logo={Discord} href={social.discord} />}
        </div>
      </CardHeader>
      <CardContent css={{ gap: '16px' }}>
        <div>{text}</div>
        {rewardTokens.map(rewardToken => (
          <RewardTokenDetails
            key={rewardToken.address}
            token={rewardToken}
            chainId={rewardToken.chainId}
          />
        ))}
      </CardContent>
    </Card>
  );
});
