import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatLargeUsd } from '../../../../../helpers/format';
import { selectTotalTvl } from '../../../../data/selectors/tvl';
import { selectTotalActiveVaults } from '../../../../data/selectors/vaults';
import { ModalTvl } from '../ModalTvl';
import { useAppSelector } from '../../../../../store';
import { Modal } from '../../../../../components/Modal';
import { Stat } from './Stat';
import { Stats } from './Stats';

export const VaultsStats = memo(function VaultStats() {
  const [isTvlModalOpen, setIsTvlModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const totalTvl = useAppSelector(selectTotalTvl);
  const totalActiveVaults = useAppSelector(selectTotalActiveVaults);

  const handleTvlModalOpen = useCallback(() => {
    setIsTvlModalOpen(true);
  }, [setIsTvlModalOpen]);

  const handleTvlModalClose = useCallback(() => {
    setIsTvlModalOpen(false);
  }, [setIsTvlModalOpen]);

  return (
    <Stats>
      <Stat
        label={t('TVL')}
        value={formatLargeUsd(totalTvl)}
        onInfo={handleTvlModalOpen}
        loading={!totalTvl}
      />
      <Stat
        label={t('Vaults-Title')}
        value={totalActiveVaults.toString()}
        loading={!totalActiveVaults}
      />
      <Modal open={isTvlModalOpen} onClose={handleTvlModalClose} scrollable={false}>
        <ModalTvl close={handleTvlModalClose} />
      </Modal>
    </Stats>
  );
});
