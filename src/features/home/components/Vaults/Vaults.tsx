import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { VaultsHeader } from './components/VaultsHeader';
import { VaultsList } from './components/VaultsList';

const useStyles = legacyMakeStyles(styles);

export const Vaults = memo(function Vaults() {
  const classes = useStyles();

  return (
    <div className={classes.vaults}>
      <VaultsHeader />
      <VaultsList />
    </div>
  );
});
