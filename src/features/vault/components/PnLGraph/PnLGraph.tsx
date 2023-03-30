import { makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import { memo } from 'react';
import { useAppSelector } from '../../../../store';
import { VaultEntity } from '../../../data/entities/vault';
import {
  selectIsAnalyticsLoaded,
  selectUserDepositedTimelineByVaultId,
} from '../../../data/selectors/analytics';
import { selectUserDepositedVaultIds } from '../../../data/selectors/balance';
import { selectVaultById } from '../../../data/selectors/vaults';
import { Footer } from './components/Footer';
import { Graph } from './components/Graph';
import { Header } from './components/Header';
import { useVaultPeriods } from './hooks';

import { Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  pnlContainer: {
    borderRadius: '12px',
    backgroundColor: '#2D3153',
  },
}));

interface PnLGraphProps {
  vaultId: VaultEntity['id'];
}

export const PnLGraphLoader = memo<PnLGraphProps>(function ({ vaultId }) {
  const userVaults = useAppSelector(selectUserDepositedVaultIds);

  const vault = useAppSelector(state => selectVaultById(state, vaultId));

  const vaultTimeline = useAppSelector(state =>
    selectUserDepositedTimelineByVaultId(state, vaultId)
  );

  const isLoaded = useAppSelector(selectIsAnalyticsLoaded);

  if (
    isLoaded &&
    userVaults.includes(vaultId) &&
    vaultTimeline.length !== 0 &&
    vault.status === 'active'
  ) {
    return <PnLGraph vaultId={vaultId} />;
  }
  return null;
});

export const PnLGraph = memo<PnLGraphProps>(function ({ vaultId }) {
  const classes = useStyles();

  const labels = useVaultPeriods(vaultId);

  const [period, setPeriod] = React.useState<number>(labels.length - 1);

  const handlePeriod = useCallback((newPeriod: number) => {
    setPeriod(newPeriod);
  }, []);

  return (
    <div className={classes.pnlContainer}>
      <Header vaultId={vaultId} />
      <Graph period={period} vaultId={vaultId} />
      <Footer labels={labels} vaultId={vaultId} period={period} handlePeriod={handlePeriod} />
    </div>
  );
});
