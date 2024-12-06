import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapsable } from '../../../../components/Collapsable';
import { useAppSelector } from '../../../../store';
import type { VaultEntity } from '../../../data/entities/vault';
import { selectIsVaultNexus } from '../../../data/selectors/partners';
import { OpenCoverCard } from '../OpenCoverCard';
import { NexusCard } from '../NexusCard';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

interface InsuraceCardProps {
  vaultId: VaultEntity['id'];
}

export const InsuranceCards = memo(function InsuranceCards({ vaultId }: InsuraceCardProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const isNexus = useAppSelector(state => selectIsVaultNexus(state, vaultId));

  return (
    <div className={classes.container}>
      <Collapsable openByDefault={true} titleCss={styles.title} title={t('Insurance')}>
        {isNexus && <NexusCard />}
        <OpenCoverCard vaultId={vaultId} />
      </Collapsable>
    </div>
  );
});
