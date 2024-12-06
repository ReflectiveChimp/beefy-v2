import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapsable } from '../../../../components/Collapsable';
import { useAppSelector } from '../../../../store';
import type { VaultEntity } from '../../../data/entities/vault';
import { selectIsVaultQidao } from '../../../data/selectors/partners';
import { QiDao } from '../QiDaoCard';

import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

interface LeverageCardsProps {
  vaultId: VaultEntity['id'];
}

export const LeverageCards = memo(function LeverageCards({ vaultId }: LeverageCardsProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const isQidao = useAppSelector(state => selectIsVaultQidao(state, vaultId));

  return isQidao ? (
    <div className={classes.container}>
      <Collapsable openByDefault={true} titleCss={styles.title} title={t('Leverage')}>
        <QiDao />
      </Collapsable>
    </div>
  ) : null;
});
