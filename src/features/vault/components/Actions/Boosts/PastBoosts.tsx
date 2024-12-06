import { legacyMakeStyles } from '@repo/helpers/mui';
import { Trans, useTranslation } from 'react-i18next';
import AnimateHeight from 'react-animate-height';
import { styles } from './styles';
import { selectPastBoostIdsWithUserBalance } from '../../../../data/selectors/boosts';
import type { BoostEntity } from '../../../../data/entities/boost';
import { useAppSelector } from '../../../../../store';
import { BoostPastActionCard } from './BoostPastActionCard';

const useStyles = legacyMakeStyles(styles);

export function PastBoosts({ vaultId }: { vaultId: BoostEntity['id'] }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const pastBoostsWithUserBalance = useAppSelector(state =>
    selectPastBoostIdsWithUserBalance(state, vaultId)
  );

  if (pastBoostsWithUserBalance.length <= 0) {
    return <></>;
  }

  return (
    <div className={classes.containerExpired}>
      <div className={classes.title}>
        <span>
          <Trans
            t={t}
            i18nKey="Boost-ExpiredBoost"
            values={{ count: pastBoostsWithUserBalance.length }}
            components={{ white: <span className={classes.titleWhite} /> }}
          />
        </span>
      </div>
      <AnimateHeight duration={500} height="auto" contentClassName={classes.containerExpiredBoosts}>
        {pastBoostsWithUserBalance.map(boostId => (
          <BoostPastActionCard boostId={boostId} key={boostId} />
        ))}
      </AnimateHeight>
    </div>
  );
}
