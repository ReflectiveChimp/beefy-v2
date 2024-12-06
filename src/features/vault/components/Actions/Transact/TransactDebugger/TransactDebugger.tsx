import { lazy, memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { TransactState } from './TransactState';
import { useAppSelector } from '../../../../../../store';
import { selectVaultById } from '../../../../../data/selectors/vaults';
import { selectTokenByAddressOrUndefined } from '../../../../../data/selectors/tokens';

const CurveZap = lazy(() => import(`./CurveZap`).then(module => ({ default: module.CurveZap })));
const BalancerZap = lazy(() =>
  import(`./BalancerZap`).then(module => ({ default: module.BalancerZap }))
);

const useStyles = legacyMakeStyles(styles);

type TransactDebuggerProps = {
  vaultId: string;
};

export const TransactDebugger = memo(function TransactDebugger({ vaultId }: TransactDebuggerProps) {
  const classes = useStyles();
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const depositToken = useAppSelector(state =>
    selectTokenByAddressOrUndefined(state, vault.chainId, vault.depositTokenAddress)
  );

  return (
    <div className={classes.container}>
      {depositToken && depositToken.providerId === 'curve' ? <CurveZap vaultId={vaultId} /> : null}
      {depositToken &&
      depositToken.providerId &&
      ['balancer', 'beethovenx'].includes(depositToken.providerId) ? (
        <BalancerZap vaultId={vaultId} />
      ) : null}
      <TransactState />
    </div>
  );
});
