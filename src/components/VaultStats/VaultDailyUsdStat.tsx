import type { VaultEntity } from '../../features/data/entities/vault';
import { memo } from 'react';
import { connect } from 'react-redux';
import type { BeefyState } from '../../redux-types';
import { formatLargeUsd } from '../../helpers/format';
import {
  selectIsVaultApyAvailable,
  selectVaultShouldShowInterest,
} from '../../features/data/selectors/data-loader';
import {
  selectDidAPIReturnValuesForVault,
  selectYieldStatsByVaultId,
} from '../../features/data/selectors/apy';
import { VaultValueStat } from '../VaultValueStat';
import { type CssStyles } from '@repo/styles/css';

export type VaultDailyUsdStatProps = {
  vaultId: VaultEntity['id'];
  css?: CssStyles;
  triggerCss?: CssStyles;
  walletAddress?: string;
};

export const VaultDailyUsdStat = memo(connect(mapStateToProps)(VaultValueStat));

function mapStateToProps(
  state: BeefyState,
  { vaultId, css: cssProp, triggerCss, walletAddress }: VaultDailyUsdStatProps
) {
  const label = 'Dashboard-Filter-DailyYield';

  const shouldShowInterest = selectVaultShouldShowInterest(state, vaultId);
  if (!shouldShowInterest) {
    return {
      label,
      value: '-',
      subValue: null,
      blur: false,
      loading: false,
      css: cssProp,
    };
  }

  const isLoaded = selectIsVaultApyAvailable(state, vaultId);
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

  const haveValues = selectDidAPIReturnValuesForVault(state, vaultId);
  if (!haveValues) {
    return {
      label,
      value: '???',
      subValue: null,
      blur: false,
      loading: false,
      css: cssProp,
    };
  }

  const { dailyUsd } = selectYieldStatsByVaultId(state, vaultId, walletAddress);

  return {
    label,
    value: formatLargeUsd(dailyUsd),
    subValue: null,
    blur: false,
    loading: !isLoaded,
    boosted: false,
    tooltip: null,
    css: cssProp,
    triggerCss,
  };
}
