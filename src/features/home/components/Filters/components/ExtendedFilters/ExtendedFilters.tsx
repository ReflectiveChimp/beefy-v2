import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PlatformDropdownFilter } from '../PlatformFilters';
import { VaultCategoryDropdownFilter } from '../VaultCategoryFilters';
import { CheckboxFilter } from '../CheckboxFilter';
import { ShownVaultsCount } from './ShownVaultsCount';
import { AssetTypeDropdownFilter } from '../AssetTypeFilters';
import { MinTvlFilter } from '../MinTvlFilter';
import { StrategyTypeDropdownFilter } from '../StrategyTypeFilters';
import { styled } from '@repo/styles/jsx';

export type ExtendedFiltersProps = {
  desktopView: boolean;
};

export const ExtendedFilters = memo<ExtendedFiltersProps>(function ExtendedFilters({
  desktopView,
}) {
  const { t } = useTranslation();

  return (
    <Layout>
      <ShownVaultsCount />
      <CheckboxFilter filter="onlyBoosted" label={t('Filter-Boost')} />
      <CheckboxFilter filter="onlyEarningPoints" label={t('Filter-Points')} />
      <CheckboxFilter filter="onlyZappable" label={t('Filter-Zappable')} />
      <CheckboxFilter filter="onlyRetired" label={t('Filter-Retired')} />
      <CheckboxFilter filter="onlyPaused" label={t('Filter-Paused')} />
      <MinTvlFilter />
      {!desktopView ? (
        <>
          <VaultCategoryDropdownFilter />
          <AssetTypeDropdownFilter />
          <StrategyTypeDropdownFilter layer={1} />
        </>
      ) : null}
      <PlatformDropdownFilter />
    </Layout>
  );
});

const Layout = styled('div', {
  base: {
    color: 'text.light',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '16px',
  },
});
