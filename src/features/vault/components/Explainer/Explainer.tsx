import {
  isCowcentratedLikeVault,
  isStandardVault,
  type VaultEntity,
} from '../../../data/entities/vault';
import { lazy, memo } from 'react';
import { useAppSelector } from '../../../../store';
import { selectVaultById } from '../../../data/selectors/vaults';

const StandardExplainer = lazy(() => import(`./Standard`));
const GovExplainer = lazy(() => import(`./Gov`));
const CowcentratedExplainer = lazy(() => import(`./Cowcentrated`));

export type ExplainerProps = {
  vaultId: VaultEntity['id'];
};

export const Explainer = memo(function Explainer({ vaultId }: ExplainerProps) {
  const vault = useAppSelector(state => selectVaultById(state, vaultId));

  if (isCowcentratedLikeVault(vault)) {
    return <CowcentratedExplainer vaultId={vaultId} />;
  }

  if (isStandardVault(vault)) {
    return <StandardExplainer vaultId={vaultId} />;
  }

  return <GovExplainer vaultId={vaultId} />;
});
