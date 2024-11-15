import { memo } from 'react';
import { BusdBannerHome } from '../../../../components/Banners/BusdBanner';
// import { AnnouncementBanner } from '../../../../components/Banners/AnnouncementBanner';
import { UnstakedClmBanner } from '../../../../components/Banners/UnstakedClmBanner';
import { styled } from '@repo/styles/jsx';

export const Banners = memo(function Banners() {
  return (
    <BannerList>
      {/* <AnnouncementBanner /> */}
      <UnstakedClmBanner />
      <BusdBannerHome />
    </BannerList>
  );
});

const BannerList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    '& > :last-child': {
      marginBottom: '24px',
    },
  },
});
