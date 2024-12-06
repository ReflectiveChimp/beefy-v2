import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { memo } from 'react';
import type { VaultEntity } from '../../features/data/entities/vault';
import { css } from '@repo/styles/css';
import { VaultDepositStat } from './VaultDepositStat';
import { VaultWalletStat } from './VaultWalletStat';
import { VaultApyStat } from './VaultApyStat';
import { VaultTvlStat } from './VaultTvlStat';
import { VaultSafetyStat } from './VaultSafetyStat';

const useStyles = legacyMakeStyles(styles);

export type VaultStatsProps = {
  vaultId: VaultEntity['id'];
};
export const VaultStats = memo(function VaultStats({ vaultId }: VaultStatsProps) {
  const classes = useStyles();

  return (
    <div className={classes.vaultStats}>
      <div className={css(styles.row)}>
        <div className={classes.column}>
          <VaultWalletStat vaultId={vaultId} />
        </div>
        <div className={classes.column}>
          <VaultDepositStat vaultId={vaultId} />
        </div>
        <div className={classes.column}>
          <VaultApyStat type="yearly" vaultId={vaultId} />
        </div>
        <div className={classes.column}>
          <VaultApyStat type="daily" vaultId={vaultId} />
        </div>
        <div className={classes.column}>
          <VaultTvlStat vaultId={vaultId} />
        </div>
        <div className={classes.column}>
          <VaultSafetyStat vaultId={vaultId} />
        </div>
      </div>
    </div>
  );
});
