import { memo } from 'react';
import { VaultEntity } from '../../../data/entities/vault';

export type VaultMetaProps = {
  vaultId: VaultEntity['id'];
};
export const VaultMeta = memo<VaultMetaProps>(function ({ vaultId }) {
  return null;
});
