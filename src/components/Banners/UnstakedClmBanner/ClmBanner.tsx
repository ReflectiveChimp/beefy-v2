import { memo } from 'react';
import { Banner } from '../Banner';
import type { ClmBannerProps } from './types';
import clmIcon from '../../../images/icons/clm.svg';

export const ClmBanner = memo<ClmBannerProps>(function ClmBanner(rest) {
  return (
    <Banner
      variant="warning"
      icon={<img src={clmIcon} alt="" width={24} height={24} />}
      {...rest}
    />
  );
});
