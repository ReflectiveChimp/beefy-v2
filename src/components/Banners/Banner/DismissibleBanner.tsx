import { memo, useCallback } from 'react';
import type { DismissibleBannerProps } from './types';
import { Banner } from './Banner';
import { useLocalStorageBoolean } from '@repo/helpers/useLocalStorageBoolean';

export const DismissibleBanner = memo<DismissibleBannerProps>(function DismissibleBanner({
  id,
  ...rest
}) {
  const [hideBanner, setHideBanner] = useLocalStorageBoolean(`banner.${id}`, false);

  const closeBanner = useCallback(() => {
    setHideBanner(true);
  }, [setHideBanner]);

  if (hideBanner) {
    return null;
  }

  return <Banner {...rest} onClose={closeBanner} />;
});
