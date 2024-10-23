import { memo, type ReactNode } from 'react';
import { useAppSelector } from '../../../../store';
import type { VaultEntity } from '../../../data/entities/vault';
import { selectVaultById } from '../../../data/selectors/vaults';
import { TokenCard } from '../DetailsCards';
import { css } from '@styles/css';

interface AssetsCardProps {
  vaultId: VaultEntity['id'];
}

export const AssetsCard = memo<AssetsCardProps>(function AssetsCard({ vaultId }) {
  const vault = useAppSelector(state => selectVaultById(state, vaultId));

  return (
    <Tokens>
      {vault.assetIds.map(tokenId => (
        <TokenCard key={tokenId} chainId={vault.chainId} tokenId={tokenId} />
      ))}
    </Tokens>
  );
});

const tokensStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: '16px',
});

const Tokens = memo(function Tokens(props: { children: ReactNode }) {
  return <div className={tokensStyles} {...props} />;
});
