import type { VaultEntity } from '../../features/data/entities/vault';
import { memo } from 'react';
import { connect } from 'react-redux';
import type { BeefyState } from '../../redux-types';
import { formatLargePercent, formatLargeUsd } from '../../helpers/format';
import { VaultValueStat, type VaultValueStatProps } from '../VaultValueStat';
import {
  selectIsAnalyticsLoadedByAddress,
  selectUserDepositedTimelineByVaultId,
} from '../../features/data/selectors/analytics';
import { isUserClmPnl, type UserVaultPnl } from '../../features/data/selectors/analytics-types';
import { ClmPnlTooltipContent } from '../PnlTooltip/ClmPnlTooltipContent';
import { showClmPnlTooltip } from '../PnlTooltip/helpers';
import { type CssStyles } from '@repo/styles/css';

export type VaultDailyStatProps = {
  vaultId: VaultEntity['id'];
  css?: CssStyles;
  pnlData: UserVaultPnl;
  walletAddress: string;
};

export const VaultPnlStat = memo(connect(mapStateToProps)(VaultValueStat));

function mapStateToProps(
  state: BeefyState,
  { vaultId, css: cssProp, pnlData, walletAddress }: VaultDailyStatProps
) {
  const label = 'VaultStat-Pnl';
  const vaultTimeline = selectUserDepositedTimelineByVaultId(state, vaultId, walletAddress);
  const isLoaded = selectIsAnalyticsLoadedByAddress(state, walletAddress);

  if (!isLoaded) {
    return {
      label,
      value: '-',
      subValue: null,
      blur: false,
      loading: true,
      css: cssProp,
    };
  }

  if (!vaultTimeline || !vaultTimeline.current.length) {
    return {
      label,
      value: '-',
      subValue: null,
      blur: false,
      loading: false,
      css: cssProp,
    };
  }

  let value: string, subValue: string | null;
  if (isUserClmPnl(pnlData)) {
    value = formatLargeUsd(pnlData.pnl.withClaimedPending.usd);
    subValue = formatLargePercent(pnlData.pnl.withClaimedPending.percentage);
  } else {
    const { totalPnlUsd, pnlPercentage } = pnlData;
    value = formatLargeUsd(totalPnlUsd);
    subValue = formatLargePercent(pnlPercentage);
  }

  return {
    label,
    value,
    subValue,
    blur: false,
    loading: !isLoaded,
    boosted: false,
    tooltip: showClmPnlTooltip(pnlData) ? <ClmPnlTooltipContent userPnl={pnlData} /> : undefined,
    css: cssProp,
  };
}
