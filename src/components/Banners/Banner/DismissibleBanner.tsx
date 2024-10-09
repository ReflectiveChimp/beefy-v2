import { memo, useCallback } from 'react';
import type { DismissibleBannerProps } from './types';
import { useLocalStorageBoolean } from '../../../helpers/useLocalStorageBoolean';
import { Banner } from './Banner';

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
