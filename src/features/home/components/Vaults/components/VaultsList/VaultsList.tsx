import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { selectFilteredVaults } from '../../../../../data/selectors/filtered-vaults';
import { NoResults } from '../NoResults';
import { VirtualVaultsList } from '../VirtualVaultsList';
import { styles } from './styles';
import { useAppSelector } from '../../../../../../store';

const useStyles = legacyMakeStyles(styles);

export const VaultsList = memo(function VaultsList() {
  const vaultIds = useAppSelector(selectFilteredVaults);
  const classes = useStyles();

  return (
    <div className={classes.vaultsList}>
      {vaultIds.length === 0 ? <NoResults /> : null}
      <VirtualVaultsList vaultIds={vaultIds} />
    </div>
  );
});
