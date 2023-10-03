import React, { memo } from 'react';
import type { VaultEntity } from '../../../data/entities/vault';
import { Transact } from './Transact/Transact';
import { Boosts } from './Boosts';
import { Minters } from './Minter';
import { TransactDebugger } from './Transact/TransactDebugger';
import { Migration } from '../Migation';

export type ActionsProps = {
  vaultId: VaultEntity['id'];
};
export const Actions = memo<ActionsProps>(function Actions({ vaultId }) {
  return (
    <>
      {import.meta.env.VITE_TRANSACT_DEBUG ? <TransactDebugger /> : null}
      <Migration vaultId={vaultId} />
      <Transact vaultId={vaultId} />
      <Boosts vaultId={vaultId} />
      <Minters vaultId={vaultId} />
    </>
  );
});
