/* eslint-disable */
import { Fragment, memo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useAppSelector, useAppStore } from '../../../../../../store';
import { styles } from './styles';
import { selectVaultById } from '../../../../../data/selectors/vaults';
import { isStandardVault, type VaultStandard } from '../../../../../data/entities/vault';
import {
  selectTokenByAddressOrUndefined,
  selectTokenPriceByTokenOracleId,
} from '../../../../../data/selectors/tokens';
import type { ISwapAggregator } from '../../../../../data/apis/transact/swap/ISwapAggregator';
import { isTokenEqual, type TokenEntity } from '../../../../../data/entities/token';
import { getSwapAggregator } from '../../../../../data/apis/instances';
import { formatLargeUsd } from '../../../../../../helpers/format';
import { BIG_ZERO } from '../../../../../../helpers/big-number';
import {
  selectIsAddressBookLoaded,
  selectIsZapLoaded,
} from '../../../../../data/selectors/data-loader';
import type { BalancerSwapStrategyConfig } from '../../../../../data/apis/transact/strategies/strategy-configs';
import { isDefined } from '../../../../../data/utils/array-utils';

const useStyles = makeStyles(styles);

type BalancerZapProps = {
  vaultId: string;
};
const BalancerZap = memo<BalancerZapProps>(function BalancerZap({ vaultId }) {
  const classes = useStyles();
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const zap = isStandardVault(vault)
    ? vault.zaps.find(
        (zap): zap is BalancerSwapStrategyConfig =>
          zap.strategyId === 'balancer-swap' || zap.strategyId === 'balancer-pool'
      )
    : undefined;

  return (
    <div className={classes.item}>
      <h1>Balancer Zap</h1>
      {zap && isStandardVault(vault) ? <ZapLoader vault={vault} zap={zap} /> : <NoZap />}
    </div>
  );
});

const NoZap = memo(function NoZap() {
  return <div>No balancer zap strategy configured</div>;
});

type ZapLoaderProps = {
  vault: VaultStandard;
  zap: BalancerSwapStrategyConfig;
};

type ZapProps = {
  aggregatorSupportedTokens: TokenEntity[];
  vault: VaultStandard;
  zap: BalancerSwapStrategyConfig;
};

const ZapLoader = memo<ZapLoaderProps>(function ZapLoader({ vault, zap }) {
  const store = useAppStore();
  const swapLoaded = useAppSelector(
    state => selectIsZapLoaded(state) && selectIsAddressBookLoaded(state, vault.chainId)
  );
  const tokens = useAppSelector(state =>
    zap.tokens
      .map(address => selectTokenByAddressOrUndefined(state, vault.chainId, address))
      .filter(isDefined)
  );
  const [tokensSupported, setTokensSupported] = useState<TokenEntity[] | undefined>(undefined);

  useEffect(() => {
    if (swapLoaded) {
      getSwapAggregator()
        .then((aggregator: ISwapAggregator) => {
          return aggregator.fetchTokenSupport(
            tokens,
            vault.id,
            vault.chainId,
            store.getState(),
            zap.swap
          );
        })
        .then(support => {
          setTokensSupported(support.any);
        })
        .catch(error => console.error(error));

      return () => setTokensSupported(undefined);
    } else {
      setTokensSupported(undefined);
    }
  }, [setTokensSupported, vault.id, swapLoaded]);

  if (swapLoaded && tokensSupported) {
    return <Zap vault={vault} zap={zap} aggregatorSupportedTokens={tokensSupported} />;
  }

  return <div>Loading curve zap debugger...</div>;
});

const Zap = memo<ZapProps>(function Zap({ aggregatorSupportedTokens, vault, zap }) {
  const classes = useStyles();
  const tokens = useAppSelector(state =>
    zap.tokens.map(address => {
      const token = selectTokenByAddressOrUndefined(state, vault.chainId, address);
      const inAddressBook = !!token;
      const inAggregator =
        inAddressBook &&
        aggregatorSupportedTokens.some(supported => isTokenEqual(supported, token));
      const price = token ? selectTokenPriceByTokenOracleId(state, token.oracleId) : undefined;
      return { address, token, inAddressBook, inAggregator, price };
    })
  );

  return (
    <div>
      <h2>
        {zap.strategyId} - {zap.poolType}
      </h2>
      <div>{zap.poolId}</div>
      <div className={classes.grid}>
        <div className={classes.address}>Address</div>
        <div>AddressBook</div>
        <div>Price</div>
        <div>Swap</div>
        {tokens.map(token => (
          <Fragment key={token.address}>
            <div className={classes.address}>
              {token.token && token.price && token.price.gt(BIG_ZERO) ? '✔' : '❌'} {token.address}
            </div>
            <div>{token.token ? token.token.symbol : '❌'}</div>
            <div>{token.price ? formatLargeUsd(token.price) : '❌'}</div>
            <div>{token.inAggregator ? '✔' : '⚠️'}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
});

// eslint-disable-next-line no-restricted-syntax
export default BalancerZap;