import { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { ChainButtonFilter, ChainDropdownFilter } from './components/ChainFilters';
import { UserCategoryButtonFilter } from './components/UserCategoryFilters';
import { AssetTypeButtonFilter } from './components/AssetTypeFilters';
import { styles } from './styles';
import { ExtendedFiltersButton } from './components/ExtendedFilters';
import { ClearFiltersButton } from './components/ClearFiltersButton';
import clsx from 'clsx';
import { VaultCategoryButtonFilter } from './components/VaultCategoryFilters';
import { StrategyTypeButtonFilter } from './components/StrategyTypeFilters';
import { useBreakpoint } from '../../../../components/MediaQueries/useBreakpoint';
import { styled } from '@repo/styles/jsx';

const useStyles = makeStyles(styles);

export const Filters = memo(function Filters() {
  const classes = useStyles();
  const isDesktop = useBreakpoint({ from: 'lg' });

  return (
    <Layout>
      {isDesktop ? <ChainButtonFilter className={classes.chain} /> : null}
      <UserCategoryButtonFilter className={classes.userCategory} />
      {isDesktop ? (
        <>
          <VaultCategoryButtonFilter className={classes.vaultCategory} />
          <AssetTypeButtonFilter className={classes.assetType} />
          <StrategyTypeButtonFilter />
        </>
      ) : (
        <>
          <ChainDropdownFilter className={classes.chain} />
        </>
      )}
      <ExtendedFiltersButton view={isDesktop ? 'dropdown' : 'sidebar'} />
      <ClearFiltersButton className={clsx(classes.button, classes.clear)} />
    </Layout>
  );
});

const Layout = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '16px',
    columnGap: '16px',
  },
});
