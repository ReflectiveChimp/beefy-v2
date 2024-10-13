import { makeStyles } from '@material-ui/core';
import { memo, useMemo } from 'react';
import { PieChart } from '../../../../components/PieChart/PieChart';
import { ExposureBar } from '../ExposureBar';
import { ExposureLegend } from '../ExposureLegend';
import { styles } from './styles';
import type { GenericExposurePieChartProps } from '../../../../components/PieChart/types';
import { getTopNArray } from '../../../data/utils/array-utils';
import { BIG_ZERO } from '../../../../helpers/big-number';
import { Visible } from '../../../../components/MediaQueries/Visible';

const useStyles = makeStyles(styles);

type TreasuryExposureChartProps = Omit<GenericExposurePieChartProps, 'type'>;

export const TreasuryExposureChart = memo<TreasuryExposureChartProps>(
  function TreasuryExposureChart({ data, formatter }) {
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
        <Visible from="md" else={<PieChart data={topSix} type={'generic'} formatter={formatter} />}>
          <ExposureBar data={topSix} />
        </Visible>
        <ExposureLegend data={topSix} formatter={formatter} />
      </div>
    );
  }
);
