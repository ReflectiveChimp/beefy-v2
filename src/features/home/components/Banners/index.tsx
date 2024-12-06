import { memo } from 'react';
import { BusdBannerHome } from '../../../../components/Banners/BusdBanner';
// import { AnnouncementBanner } from '../../../../components/Banners/AnnouncementBanner';
import { UnstakedClmBanner } from '../../../../components/Banners/UnstakedClmBanner/UnstakedClmBanner';
import { Container } from '../../../../components/Container/Container';
import { css } from '@repo/styles/css';

const bannersCss = css.raw({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  '& > :last-child': {
    marginBottom: '24px',
  },
});

export type BannersProps = object;
export const Banners = memo<BannersProps>(function Banners() {
  return (
    <Container maxWidth="lg" css={bannersCss}>
      {/* <AnnouncementBanner /> */}
      <UnstakedClmBanner />
      <BusdBannerHome />
    </Container>
  );
});
