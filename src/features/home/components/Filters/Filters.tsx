import { memo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { ChainButtonFilter, ChainDropdownFilter } from './components/ChainFilters';
import { UserCategoryButtonFilter } from './components/UserCategoryFilters';
import { AssetTypeButtonFilter } from './components/AssetTypeFilters';
import { styles } from './styles';
import { ExtendedFiltersButton } from './components/ExtendedFilters';
import { ClearFiltersButton } from './components/ClearFiltersButton';
import { css } from '@repo/styles/css';
import { VaultCategoryButtonFilter } from './components/VaultCategoryFilters';
import { StrategyTypeButtonFilter } from './components/StrategyTypeFilters';
import { useBreakpoint } from '../../../../components/MediaQueries/useBreakpoint';

const useStyles = legacyMakeStyles(styles);

export const Filters = memo(function Filters() {
  const classes = useStyles();
  const desktopView = useBreakpoint({ from: 'lg' });

  return (
    <div className={classes.filters}>
      {desktopView ? <ChainButtonFilter css={styles.chain} /> : null}
      <UserCategoryButtonFilter css={styles.userCategory} />
      {desktopView ? (
        <>
          <VaultCategoryButtonFilter css={styles.vaultCategory} />
          <AssetTypeButtonFilter css={styles.assetType} />
          <StrategyTypeButtonFilter />
        </>
      ) : (
        <>
          <ChainDropdownFilter css={styles.chain} />
        </>
      )}
      <ExtendedFiltersButton
        css={css.raw(styles.button, styles.extended)}
        desktopView={desktopView}
      />
      <ClearFiltersButton css={css.raw(styles.button, styles.clear)} />
    </div>
  );
});
