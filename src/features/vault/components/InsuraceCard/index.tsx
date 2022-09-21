import { memo } from 'react';

import { InsuranceCard } from '../InsuranceCard';
import InsuraceLogo from '../../../../images/partners/insurace.svg';
import { useTranslation } from '../../../../mock';

export const InsuraceCard = memo(function () {
  const { t } = useTranslation();
  return (
    <InsuranceCard
      logo={InsuraceLogo}
      title={t('Insurace-Title')}
      subtitle={t('Insurace-SubTitle')}
      content={t('Insurace-Content')}
      buttonUrl="https://app.insurace.io/Insurance/Cart?id=110&chain=BSC&referrer=95244279533280151623141934507761661103282646845"
      buttonText={t('Insurace-Btn')}
    />
  );
});
