import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { VaultsSearch } from '../VaultsSearch';
import { VaultsSort } from '../VaultsSort';

const useStyles = legacyMakeStyles(styles);

export const VaultsHeader = memo(function VaultsHeader() {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <VaultsSearch css={styles.searchWidth} />
      <VaultsSort />
    </div>
  );
});
