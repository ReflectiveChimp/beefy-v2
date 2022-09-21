import React, { memo } from 'react';
import { Step } from '../Step';

import { ErrorIndicator } from '../ErrorIndicator';
import { useTranslation } from '../../../../../../mock';

export const UnsupportedCountryStep = memo(function () {
  const { t } = useTranslation();

  return (
    <Step>
      <ErrorIndicator
        title={t('OnRamp-UnsupportedCountryStep-Title')}
        content={t('OnRamp-UnsupportedCountryStep-Content')}
      />
    </Step>
  );
});
