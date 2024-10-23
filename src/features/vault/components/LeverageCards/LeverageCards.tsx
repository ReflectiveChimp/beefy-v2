import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../store';
import type { VaultEntity } from '../../../data/entities/vault';
import { selectIsVaultQidao } from '../../../data/selectors/partners';
import { QiDao } from '../QiDaoCard';
import { PartnerCards } from '../PartnerCard/PartnerCards';

interface LeverageCardsProps {
  vaultId: VaultEntity['id'];
}

export const LeverageCards = memo<LeverageCardsProps>(function LeverageCards({ vaultId }) {
  const { t } = useTranslation();
  const isQidao = useAppSelector(state => selectIsVaultQidao(state, vaultId));

  if (!isQidao) {
    return null;
  }

  return (
    <PartnerCards title={t('Leverage')} openByDefault={true}>
      <QiDao />
    </PartnerCards>
  );
});
