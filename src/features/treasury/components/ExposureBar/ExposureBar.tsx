import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { formatLargePercent } from '../../../../helpers/format';
import type { BaseEntry } from '../../../data/utils/array-utils';
import { styles } from './styles';
import { CHART_COLORS } from '../../../../helpers/charts';

const useStyles = legacyMakeStyles(styles);

interface ExposureBarProps {
  data: BaseEntry[];
}

export const ExposureBar = memo(function ExposureBar({ data }: ExposureBarProps) {
  const classes = useStyles();
  return (
    <div className={classes.bar}>
      {Object.values(data).map((item, i) => (
        <div
          key={item.key}
          style={{
            backgroundColor: CHART_COLORS[i],
            width: formatLargePercent(item.percentage, 2, '0%'),
          }}
          className={classes.barItem}
        />
      ))}
    </div>
  );
});
