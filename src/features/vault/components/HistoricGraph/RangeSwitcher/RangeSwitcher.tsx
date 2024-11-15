import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButtons } from '../../../../../components/ToggleButtons';
import type { TimeRange } from '../utils';

export type RangeSwitcherProps = {
  availableRanges: TimeRange[];
  range: TimeRange;
  onChange: (newBucket: TimeRange) => void;
};

export const RangeSwitcher = memo<RangeSwitcherProps>(function RangeSwitcher({
  availableRanges,
  range,
  onChange,
}) {
  const { t } = useTranslation();
  const options: Record<string, string> = useMemo(() => {
    return Object.fromEntries(availableRanges.map(range => [range, t(`Graph-${range}`)]));
  }, [availableRanges, t]);

  useEffect(() => {
    if (availableRanges.length > 0 && !availableRanges.includes(range)) {
      onChange(availableRanges[availableRanges.length - 1]);
    }
  }, [range, availableRanges, onChange]);

  return (
    <ToggleButtons
      value={range}
      options={options}
      onChange={onChange}
      noBackground={true}
      noPadding={true}
      variant="range"
    />
  );
});
