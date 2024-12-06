import { legacyMakeStyles } from '@repo/helpers/mui';
import { useTranslation } from 'react-i18next';
import { selectIsPlatformsAvailable } from '../../../data/selectors/data-loader';
import { styles } from './styles';
import { useAppSelector } from '../../../../store';
import { IconButtonLink } from '../../../../components/IconButtonLink/IconButtonLink';
import { ReactComponent as Link } from '@repo/images/icons/mui/Link.svg';
import { ReactComponent as Twitter } from '@repo/images/icons/mui/Twitter.svg';
import { ReactComponent as DocsIcon } from '../../../../images/icons/navigation/docs.svg';
import { memo } from 'react';
import type { PlatformEntity } from '../../../data/entities/platform';
import { selectPlatformById } from '../../../data/selectors/platforms';
import { TagTooltip, TagWithTooltip } from '../BridgeTag';
import { getPlatformSrc, platformAssetExists } from '../../../../helpers/platformsSrc';
import { css } from '@repo/styles/css';

const useStyles = legacyMakeStyles(styles);

function PlatformCardDisplay({ platform }: { platform: PlatformEntity }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <div className={classes.assetIconSymbol}>
          <PlatformImage platformId={platform.id} />
          <div className={classes.assetSymbol}>{platform.name}</div>
        </div>
        <div className={classes.assetLinks}>
          {platform.website && (
            <IconButtonLink
              Icon={Link}
              text={t('Token-Site')}
              href={platform.website}
              textCss={styles.assetLinkText}
            />
          )}
          {platform.documentation && (
            <IconButtonLink
              Icon={DocsIcon}
              href={platform.documentation}
              text={t('Token-Docs')}
              textCss={styles.assetLinkText}
            />
          )}
          {platform.twitter && (
            <IconButtonLink
              Icon={Twitter}
              href={`https://x.com/${platform.twitter}`}
              text={t('Details-Platform-Link-Twitter')}
              textCss={styles.assetLinkText}
            />
          )}
        </div>
        <div className={classes.assetBridgePrice}>
          {platform.type ? (
            <TagWithTooltip
              content={
                <TagTooltip content={t(`Details-Platform-Type-Description-${platform.type}`)} />
              }
            >
              {t(`Details-Platform-Type-${platform.type}`)}
            </TagWithTooltip>
          ) : null}
        </div>
      </div>
      <div className={css(styles.description, !platform.description && styles.descriptionPending)}>
        {platform.description ? platform.description : t('Details-Platform-Description-pending')}
      </div>
    </div>
  );
}

function PlatformCardComponent({ platformId }: { platformId: PlatformEntity['id'] }) {
  const platformsLoaded = useAppSelector(selectIsPlatformsAvailable);
  const platform = useAppSelector(state =>
    platformsLoaded ? selectPlatformById(state, platformId) : null
  );

  if (!platformsLoaded || !platform) {
    return <></>;
  }

  return <PlatformCardDisplay platform={platform} />;
}

export const PlatformCard = memo(PlatformCardComponent);

const PlatformImage = memo(function PlatformImage({ platformId }: { platformId: string }) {
  const classes = useStyles();
  return (
    <>
      {platformAssetExists(platformId) ? (
        <img
          src={getPlatformSrc(platformId)}
          alt={platformId}
          height={24}
          className={classes.assetIcon}
        />
      ) : (
        <></>
      )}
    </>
  );
});
