import { type FC, memo, useEffect, useMemo, useState } from 'react';
import type { VaultEntity } from '../../../../data/entities/vault';
import { Card, CardContent, CardHeader, CardTitle } from '../../Card';
import { useTranslation } from 'react-i18next';
import { StatSwitcher } from '../../StatSwitcher';
import { styles } from './styles';
import { makeStyles } from '@material-ui/core';
import { OverviewGraphHeader } from './components/OverviewGraphHeader';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { selectVaultById } from '../../../../data/selectors/vaults';
import { selectHasBreakdownDataByTokenAddress } from '../../../../data/selectors/tokens';
import {
  selectIsAddressBookLoaded,
  selectIsContractDataLoadedOnChain,
} from '../../../../data/selectors/data-loader';
import { selectHasDataToShowGraphByVaultId } from '../../../../data/selectors/analytics';
import { CLMOverviewGraph } from './components/OverviewGraph';
import { useVaultPeriodsOverviewGraph } from './components/OverviewGraph/hooks';
import { FeesFooter, OverviewFooter } from './components/Footers';
import { FeesGraphHeader } from './components/FeesGraphHeader';
import {
  fetchClmHarvestsForUserVault,
  fetchClmPendingRewards,
} from '../../../../data/actions/analytics';
import { selectWalletAddress } from '../../../../data/selectors/wallet';
import { CLMFeesGraph } from './components/FeesGraph';
import { useVaultPeriodsFeesGraph } from './components/FeesGraph/hooks';
import { ErrorBoundary } from '../../../../../components/ErrorBoundary/ErrorBoundary';
import { GraphNoData } from '../../../../../components/GraphNoData/GraphNoData';

const useStyles = makeStyles(styles);

interface CowcentratedPnlGraphLoaderProps {
  vaultId: VaultEntity['id'];
  address?: string;
}

export const CowcentratedPnlGraphLoader = memo<CowcentratedPnlGraphLoaderProps>(
  function CowcentratedPnlGraphLoader({ vaultId, address }) {
    const walletAddress = useAppSelector(state => address || selectWalletAddress(state));
    const vault = useAppSelector(state => selectVaultById(state, vaultId));
    const haveBreakdownData = useAppSelector(state =>
      selectHasBreakdownDataByTokenAddress(state, vault.depositTokenAddress, vault.chainId)
    );
    const isContractDataLoaded = useAppSelector(state =>
      selectIsContractDataLoadedOnChain(state, vault.chainId)
    );
    const hasData = useAppSelector(state =>
      selectHasDataToShowGraphByVaultId(state, vaultId, walletAddress)
    );
    const isAddressBookLoaded = useAppSelector(state =>
      selectIsAddressBookLoaded(state, vault.chainId)
    );

    if (
      haveBreakdownData &&
      isAddressBookLoaded &&
      hasData &&
      isContractDataLoaded &&
      walletAddress
    ) {
      return <CowcentratedPnlGraph vaultId={vaultId} address={walletAddress} />;
    }

    return null;
  }
);

interface CowcentratedPnlGraphProps {
  vaultId: VaultEntity['id'];
  address: string;
}

export const OverviewGraph = memo<CowcentratedPnlGraphProps>(function OverviewGraph({
  vaultId,
  address,
}) {
  const classes = useStyles();
  const labels = useVaultPeriodsOverviewGraph(vaultId, address);
  const [period, setPeriod] = useState<number>(labels.length - 1);
  const canShowGraph = labels.length > 0;

  return (
    <CardContent className={classes.content}>
      <OverviewGraphHeader vaultId={vaultId} />
      <div className={classes.graphContainer}>
        {canShowGraph ? (
          <ErrorBoundary>
            <CLMOverviewGraph period={period} address={address} vaultId={vaultId} />
          </ErrorBoundary>
        ) : (
          <GraphNoData reason="wait-collect" />
        )}
      </div>
      {canShowGraph ? (
        <OverviewFooter labels={labels} period={period} handlePeriod={setPeriod} />
      ) : null}
    </CardContent>
  );
});

export const FeesGraph = memo<CowcentratedPnlGraphProps>(function FeesGraph({ vaultId, address }) {
  const classes = useStyles();
  const labels = useVaultPeriodsFeesGraph(vaultId, address);
  const [period, setPeriod] = useState<number>(labels.length - 1);
  const canShowGraph = labels.length > 0;

  return (
    <CardContent className={classes.content}>
      <FeesGraphHeader vaultId={vaultId} address={address} />
      <div className={classes.graphContainer}>
        {canShowGraph ? (
          <CLMFeesGraph vaultId={vaultId} period={period} address={address} />
        ) : (
          <GraphNoData reason="wait-collect" />
        )}
      </div>
      {canShowGraph ? (
        <FeesFooter labels={labels} vaultId={vaultId} period={period} handlePeriod={setPeriod} />
      ) : null}
    </CardContent>
  );
});

const chartToComponent = {
  overview: OverviewGraph,
  fees: FeesGraph,
} as const satisfies Record<string, FC<CowcentratedPnlGraphProps>>;

type ChartType = keyof typeof chartToComponent;

export const CowcentratedPnlGraph = memo<CowcentratedPnlGraphProps>(function CowcentratedPnlGraph({
  vaultId,
  address,
}) {
  const dispatch = useAppDispatch();
  const [stat, setStat] = useState<ChartType>('overview');
  const { t } = useTranslation();
  const classes = useStyles();
  const { strategyTypeId } = useAppSelector(state => selectVaultById(state, vaultId));

  useEffect(() => {
    if (strategyTypeId === 'compounds') {
      dispatch(fetchClmHarvestsForUserVault({ vaultId, walletAddress: address }));
    }
    dispatch(fetchClmPendingRewards({ vaultId }));
  }, [dispatch, vaultId, address, strategyTypeId]);

  const options = useMemo(() => {
    return {
      overview: t('Graph-Overview'),
      ...(strategyTypeId === 'compounds' ? { fees: t('Graph-Fees') } : {}),
    };
  }, [t, strategyTypeId]);

  const GraphComponent = chartToComponent[stat];

  return (
    <Card className={classes.card}>
      <CardHeader className={classes.header}>
        <CardTitle title={t('Graph-PositionPerformance')} />
        {Object.keys(options).length > 1 ? (
          <StatSwitcher stat={stat} options={options} onChange={setStat as (v: string) => void} />
        ) : null}
      </CardHeader>
      <ErrorBoundary>
        <GraphComponent vaultId={vaultId} address={address} />
      </ErrorBoundary>
    </Card>
  );
});

export const DashboardOverviewGraph = memo<CowcentratedPnlGraphProps>(
  function DashboardOverviewGraph({ vaultId, address }) {
    const classes = useStyles();
    const labels = useVaultPeriodsOverviewGraph(vaultId, address);
    const [period, setPeriod] = useState<number>(labels.length - 1);
    const canShowGraph = labels.length > 0;

    return (
      <div className={classes.dashboardPnlContainer}>
        {canShowGraph ? (
          <>
            <CLMOverviewGraph address={address} period={period} vaultId={vaultId} />
            <OverviewFooter
              className={classes.footerDashboard}
              tabsClassName={classes.tabsDashboard}
              labels={labels}
              period={period}
              handlePeriod={setPeriod}
            />
          </>
        ) : (
          <GraphNoData reason="wait-collect" />
        )}
      </div>
    );
  }
);

export const DashboardFeesGraph = memo<CowcentratedPnlGraphProps>(function DashboardFeesGraph({
  vaultId,
  address,
}) {
  const classes = useStyles();
  const labels = useVaultPeriodsFeesGraph(vaultId, address);
  const [period, setPeriod] = useState<number>(labels.length - 1);
  const canShowGraph = labels.length > 0;

  return (
    <div className={classes.dashboardPnlContainer}>
      {canShowGraph ? (
        <>
          <CLMFeesGraph address={address} period={period} vaultId={vaultId} />
          <FeesFooter
            className={classes.footerDashboard}
            tabsClassName={classes.tabsDashboard}
            labels={labels}
            vaultId={vaultId}
            period={period}
            handlePeriod={setPeriod}
          />
        </>
      ) : (
        <GraphNoData reason="wait-collect" />
      )}
    </div>
  );
});
