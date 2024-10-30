import { memo } from 'react';
import { ChainButtonFilter, ChainDropdownFilter } from './components/ChainFilters';
import { UserCategoryButtonFilter } from './components/UserCategoryFilters';
import { AssetTypeButtonFilter } from './components/AssetTypeFilters';
import { ExtendedFiltersButton } from './components/ExtendedFilters';
import { ClearFiltersButton } from './components/ClearFiltersButton';
import { VaultCategoryButtonFilter } from './components/VaultCategoryFilters';
import { StrategyTypeButtonFilter } from './components/StrategyTypeFilters';
import { useBreakpoint } from '../../../../components/MediaQueries/useBreakpoint';
import { styled } from '@repo/styles/jsx';

export const Filters = memo(function Filters() {
  const isDesktop = useBreakpoint({ from: 'lg' });

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
});

const MobileLayout = memo(function MobileLayout() {
  return (
    <Layout>
      <UserCategoryButtonFilter />
      <ChainDropdownFilter />
      <HalfHalf>
        <ExtendedFiltersButton view="sidebar" />
        <ClearFiltersButton />
      </HalfHalf>
    </Layout>
  );
});

const DesktopLayout = memo(function DesktopLayout() {
  return (
    <Layout>
      <Top>
        <ChainButtonFilter />
      </Top>
      <Bottom>
        <Left>
          <UserCategoryButtonFilter />
        </Left>
        <Right>
          <VaultCategoryButtonFilter />
          <AssetTypeButtonFilter />
          <StrategyTypeButtonFilter />
          <ExtendedFiltersButton view="dropdown" />
          <ClearFiltersButton />
        </Right>
      </Bottom>
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

const Top = styled('div', {
  base: {
    width: '100%',
  },
});

const Bottom = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'nowrap',
    width: '100%',
    gap: 'inherit',
  },
});

const Left = styled('div', {
  base: {
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'inherit',
    gap: 'inherit',
  },
});

const Right = styled('div', {
  base: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'inherit',
    gap: 'inherit',
  },
});

const HalfHalf = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(0px, 1fr))',
    gap: 'inherit',
    width: '100%',
  },
});
