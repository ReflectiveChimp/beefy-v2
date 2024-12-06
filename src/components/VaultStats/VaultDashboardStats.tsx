import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { type VaultEntity } from '../../features/data/entities/vault';
import { css } from '@repo/styles/css';
import { VaultDailyUsdStat } from './VaultDailyUsdStat';
import { VaultPnlStat } from './VaultPnlStat';
import { VaultAtDepositStat } from './VaultAtDepositStat';
import { VaultApyStat } from './VaultApyStat';
import { useAppSelector } from '../../store';
import { selectVaultPnl } from '../../features/data/selectors/analytics';
import { VaultYieldRewardsStat } from './VaultYieldRewardsStat';
import { VaultDepositStat } from './VaultDepositStat';

const useStyles = legacyMakeStyles(styles);

export type VaultStatsProps = {
  vaultId: VaultEntity['id'];
  address: string;
};
export const VaultDashboardStats = memo(function VaultStats({ vaultId, address }: VaultStatsProps) {
  const classes = useStyles();
  const pnlData = useAppSelector(state => selectVaultPnl(state, vaultId, address));

  return (
    <div className={classes.vaultStats}>
      <div className={css(styles.rowDashboard)}>
        <div className={css(styles.column, styles.columnDashboard, styles.hideSm)}>
          <VaultAtDepositStat
            pnlData={pnlData}
            triggerCss={styles.textOverflow}
            showLabel={false}
            vaultId={vaultId}
            walletAddress={address}
          />
        </div>
        <div className={css(styles.column, styles.columnDashboard, styles.hideSm)}>
          <VaultDepositStat
            triggerCss={styles.textOverflow}
            showLabel={false}
            vaultId={vaultId}
            walletAddress={address}
          />
        </div>
        <div className={css(styles.column, styles.columnDashboard, styles.hideSm)}>
          <VaultYieldRewardsStat showLabel={false} vaultId={vaultId} walletAddress={address} />
        </div>
        <div className={classes.column}>
          <VaultPnlStat
            walletAddress={address}
            pnlData={pnlData}
            showLabel={false}
            vaultId={vaultId}
          />
        </div>
        <div className={css(styles.column, styles.columnDashboard, styles.hideMd)}>
          <VaultApyStat type="yearly" showLabel={false} vaultId={vaultId} />
        </div>
        <div className={css(styles.column, styles.columnDashboard, styles.hideMd)}>
          <VaultDailyUsdStat
            triggerCss={styles.textOverflow}
            showLabel={false}
            vaultId={vaultId}
            walletAddress={address}
          />
        </div>
      </div>
    </div>
  );
});
