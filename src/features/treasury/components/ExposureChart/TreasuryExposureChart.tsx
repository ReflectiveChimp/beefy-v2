import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo, useMemo } from 'react';
import { PieChart } from '../../../../components/PieChart/PieChart';
import { ExposureBar } from '../ExposureBar';
import { ExposureLegend } from '../ExposureLegend';
import { styles } from './styles';
import type { GenericExposurePieChartProps } from '../../../../components/PieChart/types';
import { getTopNArray } from '../../../data/utils/array-utils';
import { BIG_ZERO } from '../../../../helpers/big-number';
import { Hidden } from '../../../../components/MediaQueries/Hidden';

const useStyles = legacyMakeStyles(styles);

type TreasuryExposureChartProps = Omit<GenericExposurePieChartProps, 'type'>;

export const TreasuryExposureChart = memo(function TreasuryExposureChart({
  data,
  formatter,
}: TreasuryExposureChartProps) {
  const classes = useStyles();
  const topSix = useMemo(
    () =>
      getTopNArray(data, 'percentage', 6, {
        key: 'others',
        value: BIG_ZERO,
        percentage: 0,
      }),
    [data]
  );

  return (
    <div className={classes.container}>
      <Hidden to="xs">
        <ExposureBar data={topSix} />
      </Hidden>
      <Hidden from="sm">
        <PieChart data={topSix} type={'generic'} formatter={formatter} />
      </Hidden>
      <ExposureLegend data={topSix} formatter={formatter} />
    </div>
  );
});
