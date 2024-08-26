import { memo } from 'react';
import type { VaultEntity } from '../../../../../../data/entities/vault';
import { makeStyles } from '@material-ui/core';
import { Stat } from '../Stat';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../../../store';
import { selectClmPnl } from '../../../../../../data/selectors/analytics';
import {
  formatLargeUsd,
  formatPositiveOrNegative,
  formatTokenDisplayCondensed,
} from '../../../../../../../helpers/format';
import { BIG_ZERO } from '../../../../../../../helpers/big-number';
import { Tooltip } from '../../../../../../../components/Tooltip';
import { HelpOutline } from '@material-ui/icons';
import { styles } from './styles';

interface OverviewGraphHeaderProps {
  vaultId: VaultEntity['id'];
}

const useStyles = makeStyles(styles);

export const OverviewGraphHeader = memo<OverviewGraphHeaderProps>(function OverviewGraphHeader({
  vaultId,
}) {
  const classes = useStyles();

  const { t } = useTranslation();

  const {
    underlyingAtDeposit,
    underlyingAtDepositInUsd,
    underlyingNow,
    underlyingNowInUsd,
    token0AtDepositInUsd,
    token1AtDepositInUsd,
    token0AtDeposit,
    token1AtDeposit,
    token1,
    token0,
    token0Diff,
    token1Diff,
    pnl,
    hold,
    holdDiff,
    realizedPnl,
  } = useAppSelector(state => selectClmPnl(state, vaultId));

  const pnlWithRewards = pnl.plus(realizedPnl.claims.totalUsd);
  const holdDiffWithRewards = holdDiff.plus(realizedPnl.claims.totalUsd);

  return (
    <div className={classes.statsContainer}>
      <Stat
        tooltipText={t('pnl-graph-tooltip-deposit')}
        label={t('At Deposit')}
        value0={`${formatTokenDisplayCondensed(token0AtDeposit, token0.decimals, 6)} ${
          token0.symbol
        }`}
        value1={`${formatTokenDisplayCondensed(token1AtDeposit, token1.decimals, 6)} ${
          token1.symbol
        }`}
        value2={formatTokenDisplayCondensed(underlyingAtDeposit, 18, 6)}
        subValue0={formatLargeUsd(token0AtDepositInUsd)}
        subValue1={formatLargeUsd(token1AtDepositInUsd)}
        subValue2={formatLargeUsd(underlyingAtDepositInUsd)}
      />
      <Stat
        tooltipText={t('pnl-graph-tooltip-now-clm')}
        label={t('Now')}
        value0={`${formatTokenDisplayCondensed(token0.userAmount, token0.decimals, 6)} ${
          token0.symbol
        }`}
        value1={`${formatTokenDisplayCondensed(token1.userAmount, token1.decimals, 6)} ${
          token1.symbol
        }`}
        value2={formatTokenDisplayCondensed(underlyingNow, 18, 6)}
        subValue0={formatLargeUsd(token0.userValue)}
        subValue1={formatLargeUsd(token1.userValue)}
        subValue2={formatLargeUsd(underlyingNowInUsd)}
      />
      <Stat
        tooltipText={t('pnl-graph-tooltip-change-clm')}
        label={t('Change')}
        value0={formatPositiveOrNegative(
          token0Diff,
          formatTokenDisplayCondensed(token0Diff, token0.decimals, 6),
          token0.symbol
        )}
        value1={formatPositiveOrNegative(
          token1Diff,
          formatTokenDisplayCondensed(token1Diff, token1.decimals, 6),
          token1.symbol
        )}
        value2={
          <div className={pnl.gt(BIG_ZERO) ? classes.green : classes.red}>
            {formatLargeUsd(pnl, { positivePrefix: '+$' })} PNL
          </div>
        }
        subValue2={
          <Tooltip
            children={
              <div className={classes.tooltip}>
                {`${formatLargeUsd(hold)} HOLD`} <HelpOutline />
              </div>
            }
            content={
              <div>
                <div className={classes.itemContainer}>
                  <div className={classes.label}>{t('CLM')}</div>
                  <div className={classes.value}>{formatLargeUsd(underlyingNowInUsd)}</div>
                </div>
                <div className={classes.itemContainer}>
                  <div className={classes.label}>{t('If Held')}</div>
                  <div className={classes.value}>{formatLargeUsd(hold)}</div>
                </div>
                <div className={classes.itemContainer}>
                  <div className={classes.label}>{t('CLM VS HOLD')}</div>
                  <div className={classes.value}>
                    {formatLargeUsd(holdDiff, { positivePrefix: '+$' })}
                  </div>
                </div>
                <div className={classes.itemContainer}>
                  <div className={classes.label}>{t('Pool Claimed')}</div>
                  <div className={classes.value}>{formatLargeUsd(realizedPnl.claims.totalUsd)}</div>
                </div>
                <div className={classes.itemContainer}>
                  <div className={classes.label}>{t('CLM+Claimed')}</div>
                  <div className={classes.value}>
                    {formatLargeUsd(underlyingNowInUsd.plus(realizedPnl.claims.totalUsd))}
                  </div>
                </div>
                <div className={classes.itemContainer}>
                  <div className={classes.label}>{t('CLM+Claimed VS HOLD')}</div>
                  <div className={classes.value}>
                    {formatLargeUsd(holdDiffWithRewards, { positivePrefix: '+$' })}
                  </div>
                </div>
                <div className={classes.itemContainer}>
                  <div className={classes.label}>{t('PNL+Claimed')}</div>
                  <div className={classes.value}>
                    {formatLargeUsd(pnlWithRewards, { positivePrefix: '+$' })}
                  </div>
                </div>
              </div>
            }
            contentClass={classes.tooltipContent}
            arrowClass={classes.arrow}
          />
        }
      />
    </div>
  );
});
