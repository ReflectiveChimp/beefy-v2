import { memo } from 'react';
import { styles } from './styles';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { type VaultEntity } from '../../../../../../../../data/entities/vault';
import { VaultAtDepositStat } from '../../../../../../../../../components/VaultStats/VaultAtDepositStat';
import { RowMobile } from '../../../../Row';
import { VaultApyStat } from '../../../../../../../../../components/VaultStats/VaultApyStat';
import { VaultDailyUsdStat } from '../../../../../../../../../components/VaultStats/VaultDailyUsdStat';
import { useAppSelector } from '../../../../../../../../../store';
import { MobileVaultRewardsStat } from '../../../../../../../../../components/VaultStats/MobileVaultRewardsStat';
import { selectVaultPnl } from '../../../../../../../../data/selectors/analytics';
import { MobileVaultYieldStat } from '../../../../../../../../../components/VaultStats/MobileVaultYieldStat';
import { VaultDepositStat } from '../../../../../../../../../components/VaultStats/VaultDepositStat';

const useStyles = legacyMakeStyles(styles);

interface VaultDashboardMobileStatsProps {
  vaultId: VaultEntity['id'];
  address: string;
}

export const VaultDashboardMobileStats = memo(function VaultDashboardMobileStats({
  vaultId,
  address,
}: VaultDashboardMobileStatsProps) {
  const classes = useStyles();
  const pnlData = useAppSelector(state => selectVaultPnl(state, vaultId, address));

  return (
    <RowMobile>
      <div className={classes.inner}>
        <VaultAtDepositStat
          pnlData={pnlData}
          css={styles.statMobile}
          contentCss={styles.valueContainer}
          triggerCss={styles.value}
          labelCss={styles.label}
          vaultId={vaultId}
          walletAddress={address}
        />
        <VaultDepositStat
          css={styles.statMobile}
          contentCss={styles.valueContainer}
          triggerCss={styles.value}
          labelCss={styles.label}
          vaultId={vaultId}
          walletAddress={address}
          label={'VaultStat-Now'}
        />
        <MobileVaultYieldStat
          css={styles.statMobile}
          contentCss={styles.valueContainer}
          triggerCss={styles.value}
          labelCss={styles.label}
          vaultId={vaultId}
          walletAddress={address}
        />
        <MobileVaultRewardsStat
          css={styles.statMobile}
          contentCss={styles.valueContainer}
          triggerCss={styles.value}
          labelCss={styles.label}
          vaultId={vaultId}
          walletAddress={address}
        />
        <VaultApyStat
          type={'yearly'}
          css={styles.statMobile}
          contentCss={styles.valueContainer}
          triggerCss={styles.value}
          labelCss={styles.label}
          vaultId={vaultId}
        />
        <VaultDailyUsdStat
          css={styles.statMobile}
          contentCss={styles.valueContainer}
          triggerCss={styles.value}
          labelCss={styles.label}
          vaultId={vaultId}
          walletAddress={address}
        />
      </div>
    </RowMobile>
  );
});
