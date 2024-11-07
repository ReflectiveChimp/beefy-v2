import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatLargePercent, formatLargeUsd } from '../../../../../helpers/format';
import { useAppSelector } from '../../../../../store';
import { selectUserGlobalStats } from '../../../../data/selectors/apy';
import { selectIsBalanceHidden } from '../../../../data/selectors/wallet';
import { VisibleAbove } from '../../../../../components/MediaQueries/VisibleAbove';
import { Stat } from './Stat';
import { Stats } from './Stats';
import { Visible } from '../../../../../components/MediaQueries/Visible';

export const UserStats = memo(function UserStats() {
  const stats = useAppSelector(selectUserGlobalStats);
  const hideBalance = useAppSelector(selectIsBalanceHidden);
  const { t } = useTranslation();

  return (
    <Stats>
      <Stat
        label={t('Portfolio-Deposited')}
        value={formatLargeUsd(stats.deposited)}
        blurred={hideBalance}
      />
      <Stat
        label={t('Portfolio-YieldMnth')}
        value={formatLargeUsd(stats.monthly)}
        blurred={hideBalance}
      />
      <Visible from="sm">
        <Stat
          label={t('Portfolio-YieldDay')}
          value={formatLargeUsd(stats.daily)}
          blurred={hideBalance}
        />
      </Visible>
      <VisibleAbove width={430}>
        <Stat
          label={t('Portfolio-AvgAPY')}
          value={formatLargePercent(stats.apy, 2, '0%')}
          blurred={hideBalance}
        />
      </VisibleAbove>
    </Stats>
  );
});
