import { type FC, memo, useEffect, useMemo, useState } from 'react';
import {
  isCowcentratedGovVault,
  isCowcentratedStandardVault,
  type VaultEntity,
} from '../../../../data/entities/vault';
import { Card, CardContent, CardHeader, CardTitle } from '../../Card';
import { useTranslation } from 'react-i18next';
import { StatSwitcher } from '../../StatSwitcher';
import { styles } from './styles';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { OverviewGraphHeader } from './components/OverviewGraphHeader';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { selectCowcentratedLikeVaultById } from '../../../../data/selectors/vaults';
import { selectHasBreakdownDataForVaultId } from '../../../../data/selectors/tokens';
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

const useStyles = legacyMakeStyles(styles);

interface CowcentratedPnlGraphLoaderProps {
  vaultId: VaultEntity['id'];
  address?: string;
}

export const CowcentratedPnlGraphLoader = memo(function CowcentratedPnlGraphLoader({
  vaultId,
  address,
}: CowcentratedPnlGraphLoaderProps) {
  const walletAddress = useAppSelector(state => address || selectWalletAddress(state));
  const vault = useAppSelector(state => selectCowcentratedLikeVaultById(state, vaultId));

  const haveBreakdownData = useAppSelector(state =>
    selectHasBreakdownDataForVaultId(state, vaultId)
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
});

interface CowcentratedPnlGraphProps {
  vaultId: VaultEntity['id'];
  address: string;
}

export const OverviewGraph = memo(function OverviewGraph({
  vaultId,
  address,
}: CowcentratedPnlGraphProps) {
  const classes = useStyles();
  const vault = useAppSelector(state => selectCowcentratedLikeVaultById(state, vaultId));
  const labels = useVaultPeriodsOverviewGraph(vaultId, address);
  const [period, setPeriod] = useState<number>(labels.length - 1);
  const canShowGraph = labels.length > 0;

  return (
    <CardContent css={styles.content}>
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
        <OverviewFooter
          labels={labels}
          period={period}
          handlePeriod={setPeriod}
          position={isCowcentratedStandardVault(vault)}
        />
      ) : null}
    </CardContent>
  );
});

export const FeesGraph = memo(function FeesGraph({ vaultId, address }: CowcentratedPnlGraphProps) {
  const classes = useStyles();
  const labels = useVaultPeriodsFeesGraph(vaultId, address);
  const [period, setPeriod] = useState<number>(labels.length - 1);
  const canShowGraph = labels.length > 0;

  return (
    <CardContent css={styles.content}>
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

export const CowcentratedPnlGraph = memo(function CowcentratedPnlGraph({
  vaultId,
  address,
}: CowcentratedPnlGraphProps) {
  const dispatch = useAppDispatch();
  const [stat, setStat] = useState<ChartType>('overview');
  const { t } = useTranslation();
  const vault = useAppSelector(state => selectCowcentratedLikeVaultById(state, vaultId));
  const compounds = vault.strategyTypeId === 'compounds' && isCowcentratedGovVault(vault); // TODO implement for CLM vaults || isCowcentratedStandardVault(vault);

  useEffect(() => {
    if (compounds) {
      dispatch(fetchClmHarvestsForUserVault({ vaultId, walletAddress: address }));
    }
    dispatch(fetchClmPendingRewards({ vaultId }));
  }, [dispatch, vaultId, address, compounds]);

  const options = useMemo(() => {
    return {
      overview: t('Graph-Overview'),
      ...(compounds ? { fees: t('Graph-Fees') } : {}),
    };
  }, [t, compounds]);

  const GraphComponent = chartToComponent[stat];

  return (
    <Card css={styles.card}>
      <CardHeader css={styles.header}>
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

export const DashboardOverviewGraph = memo(function DashboardOverviewGraph({
  vaultId,
  address,
}: CowcentratedPnlGraphProps) {
  const classes = useStyles();
  const vault = useAppSelector(state => selectCowcentratedLikeVaultById(state, vaultId));
  const labels = useVaultPeriodsOverviewGraph(vaultId, address);
  const [period, setPeriod] = useState<number>(labels.length - 1);
  const canShowGraph = labels.length > 0;

  return (
    <div className={classes.dashboardPnlContainer}>
      {canShowGraph ? (
        <>
          <CLMOverviewGraph address={address} period={period} vaultId={vaultId} />
          <OverviewFooter
            css={styles.footerDashboard}
            tabsCss={styles.tabsDashboard}
            labels={labels}
            period={period}
            handlePeriod={setPeriod}
            position={isCowcentratedStandardVault(vault)}
          />
        </>
      ) : (
        <GraphNoData reason="wait-collect" />
      )}
    </div>
  );
});

export const DashboardFeesGraph = memo(function DashboardFeesGraph({
  vaultId,
  address,
}: CowcentratedPnlGraphProps) {
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
            css={styles.footerDashboard}
            tabsCss={styles.tabsDashboard}
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
