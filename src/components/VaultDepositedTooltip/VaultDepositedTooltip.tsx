import { type FC, memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import type { VaultEntity } from '../../features/data/entities/vault';
import { useAppSelector } from '../../store';
import {
  selectUserVaultBalanceNotInActiveBoostInDepositToken,
  selectVaultUserBalanceInDepositTokenBreakdown,
  type UserVaultBalanceBreakdownBoost,
  type UserVaultBalanceBreakdownBridged,
  type UserVaultBalanceBreakdownEntry,
  type UserVaultBalanceBreakdownVault,
} from '../../features/data/selectors/balance';
import { selectTokenPriceByTokenOracleId } from '../../features/data/selectors/tokens';
import type { TokenEntity } from '../../features/data/entities/token';
import { type BigNumber } from 'bignumber.js';
import { TokenAmount } from '../TokenAmount';
import { formatLargeUsd } from '../../helpers/format';
import { useTranslation } from 'react-i18next';
import { selectChainById } from '../../features/data/selectors/chains';
import { selectBoostById } from '../../features/data/selectors/boosts';
import { selectVaultById } from '../../features/data/selectors/vaults';

const useStyles = legacyMakeStyles(styles);

type EntryDisplayProps = {
  entry: UserVaultBalanceBreakdownEntry;
  depositToken: TokenEntity;
  price: BigNumber;
  label: string;
};

const EntryDisplay = memo(function VaultEntry({
  entry,
  depositToken,
  price,
  label,
}: EntryDisplayProps) {
  const classes = useStyles();
  const value = entry.amount.multipliedBy(price);
  return (
    <>
      <div className={classes.label}>{label}</div>
      <div className={classes.details}>
        <div className={classes.amount}>
          <TokenAmount amount={entry.amount} decimals={depositToken.decimals} />
        </div>
        <div className={classes.value}>{formatLargeUsd(value)}</div>
      </div>
    </>
  );
});

const VaultEntry = memo(function VaultEntry({
  entry,
  depositToken,
  price,
  type,
}: EntryProps<UserVaultBalanceBreakdownVault>) {
  const { t } = useTranslation();

  return (
    <EntryDisplay
      entry={entry}
      depositToken={depositToken}
      price={price}
      label={t([`VaultStat-Deposited-${entry.type}-${type}`, `VaultStat-Deposited-${entry.type}`])}
    />
  );
});

const BoostEntry = memo(function BoostEntry({
  entry,
  depositToken,
  price,
}: EntryProps<UserVaultBalanceBreakdownBoost>) {
  const { t } = useTranslation();
  const boost = useAppSelector(state => selectBoostById(state, entry.boostId));
  return (
    <EntryDisplay
      entry={entry}
      depositToken={depositToken}
      price={price}
      label={t(`VaultStat-Deposited-${entry.type}`, { boost: boost.name })}
    />
  );
});

const BridgedEntry = memo(function BridgedEntry({
  entry,
  depositToken,
  price,
}: EntryProps<UserVaultBalanceBreakdownBridged>) {
  const { t } = useTranslation();
  const chain = useAppSelector(state => selectChainById(state, entry.chainId));

  return (
    <EntryDisplay
      entry={entry}
      depositToken={depositToken}
      price={price}
      label={t(`VaultStat-Deposited-${entry.type}`, { chain: chain.name })}
    />
  );
});

type TypeToComponentMap = {
  [T in UserVaultBalanceBreakdownEntry['type']]: FC<{
    entry: UserVaultBalanceBreakdownEntry;
  }>;
};

const typeToComponent: TypeToComponentMap = {
  vault: VaultEntry,
  boost: BoostEntry,
  bridged: BridgedEntry,
};

type EntryProps<T extends UserVaultBalanceBreakdownEntry = UserVaultBalanceBreakdownEntry> = {
  entry: T;
  depositToken: TokenEntity;
  price: BigNumber;
  type: VaultEntity['type'];
};

const Entry = memo(function Entry(props: EntryProps) {
  const Component = typeToComponent[props.entry.type];
  return <Component {...props} />;
});

export type VaultDepositedTooltipProps = {
  vaultId: VaultEntity['id'];
  walletAddress?: string;
};

export const VaultDepositedTooltip = memo(function VaultDepositedTooltip({
  vaultId,
  walletAddress,
}: VaultDepositedTooltipProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const { depositToken, entries } = useAppSelector(state =>
    selectVaultUserBalanceInDepositTokenBreakdown(state, vaultId, walletAddress)
  );
  const price = useAppSelector(state =>
    selectTokenPriceByTokenOracleId(state, depositToken.oracleId)
  );
  const notEarning = useAppSelector(state =>
    selectUserVaultBalanceNotInActiveBoostInDepositToken(state, vaultId, walletAddress)
  );

  return (
    <div className={classes.grid}>
      {entries.map(entry => (
        <Entry
          key={entry.id}
          entry={entry}
          price={price}
          depositToken={depositToken}
          type={vault.type}
        />
      ))}
      {notEarning.gt(0) && (
        <div className={classes.notInBoost}>{t('VaultStat-Deposited-NotInActiveBoost')}</div>
      )}
    </div>
  );
});
