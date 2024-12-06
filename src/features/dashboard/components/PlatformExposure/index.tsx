import { memo } from 'react';
import { useAppSelector } from '../../../../store';
import { selectIsUserBalanceAvailable } from '../../../data/selectors/data-loader';
import { ExposureChart } from '../ExposureChart';
import type { ExposureDashboardChartLoaderProps } from '../ExposureChart/types';
import { selectDashboardUserExposureByPlatform } from '../../../data/selectors/dashboard';

const PlatformExposure = memo(function PlatformExposure({
  title,
  address,
}: ExposureDashboardChartLoaderProps) {
  const platformExposureData = useAppSelector(state =>
    selectDashboardUserExposureByPlatform(state, address)
  );
  return <ExposureChart title={title} type="platform" data={platformExposureData} />;
});

export const PlatformExposureLoader = memo(function PlatformExposureLoader({
  title,
  address,
}: ExposureDashboardChartLoaderProps) {
  const isUserDataAvailable = useAppSelector(state => selectIsUserBalanceAvailable(state, address));

  if (isUserDataAvailable) {
    return <PlatformExposure address={address} title={title} />;
  }

  return null;
});
