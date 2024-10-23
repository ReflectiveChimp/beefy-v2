import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../store';
import type { VaultEntity } from '../../../data/entities/vault';
import { selectIsVaultNexus } from '../../../data/selectors/partners';
import { OpenCoverCard } from '../OpenCoverCard';
import { NexusCard } from '../NexusCard';
import { PartnerCards } from '../PartnerCard/PartnerCards';

interface InsuranceCardsProps {
  vaultId: VaultEntity['id'];
}

export const InsuranceCards = memo<InsuranceCardsProps>(function InsuranceCards({ vaultId }) {
  const { t } = useTranslation();
  const isNexus = useAppSelector(state => selectIsVaultNexus(state, vaultId));

  return (
    <PartnerCards title={t('Insurance')} openByDefault={true}>
      {isNexus && <NexusCard />}
      <OpenCoverCard vaultId={vaultId} />
    </PartnerCards>
  );
});
