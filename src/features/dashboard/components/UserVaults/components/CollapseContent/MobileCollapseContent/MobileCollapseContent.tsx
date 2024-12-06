import { memo, useMemo, useState } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { useTranslation } from 'react-i18next';
import { VaultDashboardMobileStats } from './components/VaultDashboardMobileStats';
import { VaultTransactions } from '../../VaultTransactions';
import type { VaultCollapseContentProps } from '../types';
import { styles } from './styles';
import { LabeledSelect } from '../../../../../../../components/LabeledSelect';
import { ToggleButtons } from '../../../../../../../components/ToggleButtons';
import { useChartOptions } from '../useChartOptions';
import { useMediaQuery } from '../../../../../../../components/MediaQueries/useMediaQuery';

const useStyles = legacyMakeStyles(styles);

type ToggleTabOptions = 'stats' | 'txHistory' | 'positionChart' | 'compoundsChart';

export const MobileCollapseContent = memo(function MobileCollapseContent({
  vaultId,
  address,
}: VaultCollapseContentProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [toggleTab, setToggleTab] = useState<ToggleTabOptions>('stats');
  const useDropdown = useMediaQuery('(max-width: 700px)', false);
  const { PositionGraph, CompoundsGraph, availableCharts } = useChartOptions(vaultId, address);

  const options = useMemo(
    () => ({
      stats: t('Dashboard-VaultData'),
      txHistory: t('Dashboard-TransactionHistory'),
      ...availableCharts,
    }),
    [availableCharts, t]
  );

  return (
    <div className={classes.container}>
      <div className={classes.toggleContainer}>
        {useDropdown ? (
          <LabeledSelect
            selectCss={styles.select}
            options={options}
            value={toggleTab}
            onChange={setToggleTab as (v: string) => void}
          />
        ) : (
          <ToggleButtons
            value={toggleTab}
            onChange={setToggleTab as (v: string) => void}
            options={options}
          />
        )}
      </div>
      {toggleTab === 'stats' ? (
        <VaultDashboardMobileStats address={address} vaultId={vaultId} />
      ) : toggleTab === 'txHistory' ? (
        <VaultTransactions address={address} vaultId={vaultId} />
      ) : toggleTab === 'positionChart' ? (
        <PositionGraph address={address} vaultId={vaultId} />
      ) : toggleTab === 'compoundsChart' ? (
        <CompoundsGraph address={address} vaultId={vaultId} />
      ) : null}
    </div>
  );
});
