import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo, useMemo } from 'react';
import type { VaultEntity } from '../../../../../data/entities/vault';
import { useAppSelector } from '../../../../../../store';
import { selectApyVaultUIData, selectYieldStatsByVaultId } from '../../../../../data/selectors/apy';
import { formatLargeUsd, formatTotalApy } from '../../../../../../helpers/format';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { MobileStat } from '../MobileStat';

const useStyles = legacyMakeStyles(styles);

interface TableStatsInterface {
  vaultId: VaultEntity['id'];
  address: string;
}

export const TabletStats = memo(function TabletStats({ vaultId, address }: TableStatsInterface) {
  const classes = useStyles();
  const { t } = useTranslation();
  const apy = useAppSelector(state => selectApyVaultUIData(state, vaultId));
  const { dailyUsd } = useAppSelector(state => selectYieldStatsByVaultId(state, vaultId, address));
  const formatted = useMemo(
    () => (apy.status === 'available' ? formatTotalApy(apy.values, '???') : undefined),
    [apy]
  );
  const label = useMemo(
    () => t(apy.type === 'apr' ? 'VaultStat-APR' : 'VaultStat-APY'),
    [t, apy.type]
  );

  if (apy.status !== 'available' || !formatted) {
    return (
      <div className={classes.container}>
        <MobileStat label={label} value={apy.status === 'missing' ? '?' : '-'} />
        <MobileStat
          label={t('Dashboard-Filter-DailyYield')}
          value={apy.status === 'missing' ? '?' : '-'}
        />
      </div>
    );
  }

  const isBoosted = !!apy.boosted;
  return (
    <div className={classes.container}>
      <MobileStat
        label={label}
        value={isBoosted ? formatted.boostedTotalApy : formatted.totalApy}
        valueCss={isBoosted ? styles.boostText : undefined}
      />
      <MobileStat label={t('Dashboard-Filter-DailyYield')} value={formatLargeUsd(dailyUsd)} />
    </div>
  );
});
