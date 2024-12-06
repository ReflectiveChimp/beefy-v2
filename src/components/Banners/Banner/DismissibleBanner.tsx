import { memo, useCallback } from 'react';
import { Banner } from './Banner';
import { useLocalStorageBoolean } from '../../../helpers/useLocalStorageBoolean';
import type { DismissibleBannerProps } from './types';

export const DismissibleBanner = memo(function DismissibleBanner({
  id,
  ...rest
}: DismissibleBannerProps) {
  const [hideBanner, setHideBanner] = useLocalStorageBoolean(`banner.${id}`, false);

  const closeBanner = useCallback(() => {
    setHideBanner(true);
  }, [setHideBanner]);

  if (hideBanner) {
    return null;
  }

  return <Banner {...rest} onClose={closeBanner} />;
});
