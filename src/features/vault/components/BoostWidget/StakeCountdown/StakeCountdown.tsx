import { useEffect, useState } from 'react';

import { formatCountdown } from '../../../../../helpers/format';
import { useTranslation } from '../../../../../mock';

export function StakeCountdown({ periodFinish }: { periodFinish: Date | null }) {
  const { t } = useTranslation();
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(id);
  });

  const periodFinishMS = periodFinish?.getTime() || 0;
  const diff = periodFinishMS - time;

  return <>{diff > 0 ? formatCountdown(periodFinishMS) : t('Finished')}</>;
}
