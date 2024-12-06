import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapsable } from '../../../../components/Collapsable';
import { useAppSelector } from '../../../../store';
import type { VaultEntity } from '../../../data/entities/vault';
import { selectIsPoolTogether } from '../../../data/selectors/partners';
import { styles } from './styles';
import { PoolTogetherCard } from '../PoolTogetherCard';

const useStyles = legacyMakeStyles(styles);

interface GamingCardsProps {
  vaultId: VaultEntity['id'];
}

export const GamingCards = memo(function GamingCards({ vaultId }: GamingCardsProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const isPoolTogether = useAppSelector(state => selectIsPoolTogether(state, vaultId));

  if (!isPoolTogether) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Collapsable openByDefault={true} titleCss={styles.title} title={t('Gaming')}>
        {isPoolTogether && <PoolTogetherCard vaultId={vaultId} />}
      </Collapsable>
    </div>
  );
});
