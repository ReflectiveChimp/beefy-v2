import { memo } from 'react';
import type { UnstakedClmBannerDashboardProps } from './types';
import { useAppSelector } from '../../../store';
import { selectUserUnstakedClms } from '../../../features/data/selectors/balance';
import { Container } from '../../Container/Container';
import { UnstakedClmBanner } from './UnstakedClmBanner';
import { css } from '@styles/css';

export const UnstakedClmBannerDashboard = memo<UnstakedClmBannerDashboardProps>(
  function UnstakedClmBannerDashboard({ address }) {
    const unstakedIds = useAppSelector(state => selectUserUnstakedClms(state, address));

    if (!unstakedIds.length) {
      return null;
    }

    return (
      <div className={css({ backgroundColor: 'background.header' })}>
        <Container maxWidth="lg">
          <UnstakedClmBanner />
        </Container>
      </div>
    );
  }
);
