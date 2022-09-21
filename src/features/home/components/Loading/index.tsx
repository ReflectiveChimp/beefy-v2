import React, { memo } from 'react';
import { CowLoader } from '../../../../components/CowLoader';
import { useTranslation } from '../../../../mock';

export const Loading = memo(function Loading() {
  const { t } = useTranslation();

  return <CowLoader text={t('Vaults-LoadingData')} />;
});
