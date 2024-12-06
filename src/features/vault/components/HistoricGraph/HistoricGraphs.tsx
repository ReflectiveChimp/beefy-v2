import type { VaultEntity } from '../../../data/entities/vault';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../store';
import { selectVaultById } from '../../../data/selectors/vaults';
import { selectTokenByAddress } from '../../../data/selectors/tokens';
import { selectHistoricalAvailableCharts } from '../../../data/selectors/historical';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { StatSwitcher } from '../StatSwitcher';
import { GraphWithControls } from './GraphWithControls';
import { styles } from './styles';
import { getDefaultStat } from './utils';
import { CurrentCowcentratedRangeIfAvailable } from './CurrentCowcentratedRange';
import type { ChartStat } from './types';

type HistoricGraphsProps = {
  vaultId: VaultEntity['id'];
};
export const HistoricGraphs = memo(function HistoricGraphs({ vaultId }: HistoricGraphsProps) {
  const { t } = useTranslation();
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const { oracleId } = useAppSelector(state =>
    selectTokenByAddress(state, vault.chainId, vault.depositTokenAddress)
  );
  const availableStats = useAppSelector(state =>
    selectHistoricalAvailableCharts(state, vaultId, oracleId)
  );
  const [stat, setStat] = useState<ChartStat>(() => getDefaultStat(availableStats));

  const options: Record<string, string> = useMemo(() => {
    return Object.fromEntries(
      availableStats.map(stat => [stat, t([`Graph-${stat}`, `Graph-${vault.type}-${stat}`])])
    );
  }, [availableStats, t, vault.type]);

  const [inverted, setInverted] = useState(false);

  const toggleInverted = useCallback(() => {
    setInverted(value => !value);
  }, []);

  return (
    <Card css={styles.container}>
      <CardHeader css={styles.header}>
        <CardTitle title={t('Graph-RateHist')} />
        <StatSwitcher<ChartStat> stat={stat} options={options} onChange={setStat} />
      </CardHeader>
      <CardContent css={styles.content}>
        {stat === 'clm' && (
          <CurrentCowcentratedRangeIfAvailable
            inverted={inverted}
            toggleInverted={toggleInverted}
            vaultId={vaultId}
          />
        )}
        <GraphWithControls inverted={inverted} vaultId={vaultId} oracleId={oracleId} stat={stat} />
      </CardContent>
    </Card>
  );
});
