import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { PlatformDropdownFilter } from '../PlatformFilters';
import { styles } from './styles';
import { VaultCategoryDropdownFilter } from '../VaultCategoryFilters';
import { CheckboxFilter } from '../CheckboxFilter';
import { ShownVaultsCount } from './ShownVaultsCount';
import { AssetTypeDropdownFilter } from '../AssetTypeFilters';
import { MinTvlFilter } from '../MinTvlFilter';
import { StrategyTypeDropdownFilter } from '../StrategyTypeFilters';
import { useBreakpoint } from '../../../../../../components/MediaQueries/useBreakpoint';

const useStyles = legacyMakeStyles(styles);

export type ExtendedFiltersProps = {
  desktopView: boolean;
};
export const ExtendedFilters = memo(function ExtendedFilters({
  desktopView,
}: ExtendedFiltersProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const mobileView = useBreakpoint({ to: 'xs' });

  const platformFilterPlacement = useMemo(() => {
    return mobileView ? 'top-start' : 'bottom-start';
  }, [mobileView]);

  return (
    <div className={classes.extendedFilters}>
      <ShownVaultsCount css={styles.shownVaultsCount} />
      <CheckboxFilter css={styles.checkbox} filter="onlyBoosted" label={t('Filter-Boost')} />
      <CheckboxFilter css={styles.checkbox} filter="onlyEarningPoints" label={t('Filter-Points')} />
      <CheckboxFilter css={styles.checkbox} filter="onlyZappable" label={t('Filter-Zappable')} />
      <CheckboxFilter css={styles.checkbox} filter="onlyRetired" label={t('Filter-Retired')} />
      <CheckboxFilter css={styles.checkbox} filter="onlyPaused" label={t('Filter-Paused')} />
      <MinTvlFilter />
      {!desktopView ? (
        <>
          <VaultCategoryDropdownFilter css={styles.selector} />
          <AssetTypeDropdownFilter css={styles.selector} />
          <StrategyTypeDropdownFilter css={styles.selector} />
        </>
      ) : null}

      <PlatformDropdownFilter css={styles.selector} placement={platformFilterPlacement} />
    </div>
  );
});
