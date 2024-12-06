import { memo } from 'react';
import type { VaultEntity } from '../../features/data/entities/vault';
import { useAppSelector } from '../../store';
import { selectVaultById } from '../../features/data/selectors/vaults';
import { css, type CssStyles } from '@repo/styles/css';
import type { ChainEntity } from '../../features/data/entities/chain';
import { selectChainById } from '../../features/data/selectors/chains';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { VaultIcon } from './components/VaultIcon';
import { VaultTags } from './components/VaultTags';
import { Link } from 'react-router-dom';
import { punctuationWrap } from '../../helpers/string';
import { getNetworkSrc } from '../../helpers/networkSrc';
import { selectVaultIsBoostedForFilter } from '../../features/data/selectors/filtered-vaults';

const useStyles = legacyMakeStyles(styles);

export type VaultNameProps = {
  vaultId: VaultEntity['id'];
  isLink?: boolean;
};
export const VaultName = memo(function VaultName({ vaultId, isLink }: VaultNameProps) {
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const isBoosted = useAppSelector(state => selectVaultIsBoostedForFilter(state, vaultId));

  if (isLink) {
    return (
      <Link
        to={`/vault/${vaultId}`}
        className={css(styles.vaultName, isBoosted && styles.vaultNameBoosted)}
      >
        {punctuationWrap(vault.names.list)}
      </Link>
    );
  }

  return (
    <div className={css(styles.vaultName, isBoosted && styles.vaultNameBoosted)}>
      {punctuationWrap(vault.names.list)}
    </div>
  );
});

export type VaultNetworkProps = {
  chainId: ChainEntity['id'];
  css?: CssStyles;
};
export const VaultNetwork = memo(function VaultNetwork({
  chainId,
  css: cssProp,
}: VaultNetworkProps) {
  const chain = useAppSelector(state => selectChainById(state, chainId));

  return (
    <div className={css(styles.vaultNetwork, cssProp, styles[`vaultNetwork-${chainId}`])}>
      <img alt={chain.name} src={getNetworkSrc(chainId)} width={24} height={24} />
    </div>
  );
});

export type VaultIdentityProps = {
  vaultId: VaultEntity['id'];
  networkCss?: CssStyles;
  isLink?: boolean;
};
export const VaultIdentity = memo(function VaultIdentity({
  vaultId,
  networkCss,
  isLink,
}: VaultIdentityProps) {
  const classes = useStyles();

  return (
    <div className={classes.vaultIdentity}>
      <VaultIdentityContent isLink={isLink} vaultId={vaultId} networkCss={networkCss} />
    </div>
  );
});

export const VaultIdentityContent = memo(function VaultIdentityContent({
  vaultId,
  networkCss,
  isLink,
}: VaultIdentityProps) {
  const classes = useStyles();
  const vault = useAppSelector(state => selectVaultById(state, vaultId));

  return (
    <>
      <VaultNetwork css={networkCss} chainId={vault.chainId} />
      <VaultIcon vaultId={vaultId} />
      <div className={classes.vaultNameTags}>
        <VaultName isLink={isLink} vaultId={vaultId} />
        <VaultTags vaultId={vaultId} />
      </div>
    </>
  );
});
