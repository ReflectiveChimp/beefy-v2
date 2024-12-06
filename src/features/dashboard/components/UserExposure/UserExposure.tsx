import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChainExposureLoader } from '../ChainExposure';
import { PlatformExposureLoader } from '../PlatformExposure';
import { Section } from '../../../../components/Section';
import { StablesExposure } from '../StablesExposure';
import { TokenExposureLoader } from '../TokenExposure';
import { styles } from './styles';
import { MobileUserExposure } from './components/MobileUserExposure';
import { Hidden } from '../../../../components/MediaQueries/Hidden';

const useStyles = legacyMakeStyles(styles);

export type UserExposureProps = {
  address: string;
};

export const UserExposure = memo(function UserExposure({ address }: UserExposureProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Section title={t('Overview')}>
      <div className={classes.pieChartsContainer}>
        <Hidden to="sm">
          <ChainExposureLoader address={address} title={t('Exposure-Chain')} />
          <PlatformExposureLoader address={address} title={t('Exposure-Platform')} />
          <TokenExposureLoader address={address} title={t('Exposure-Tokens')} />
        </Hidden>
        <Hidden from="md">
          <MobileUserExposure address={address} />
        </Hidden>
        <Hidden from="lg">
          <StablesExposure address={address} />
        </Hidden>
      </div>
      <Hidden to="md">
        <StablesExposure address={address} />
      </Hidden>
    </Section>
  );
});
