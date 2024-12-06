import { memo, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectPriceWithChange } from '../../features/data/selectors/tokens';
import { formatLargePercent, formatLargeUsd, formatUsd } from '../../helpers/format';
import { type BigNumber } from 'bignumber.js';
import { fetchHistoricalPrices } from '../../features/data/actions/historical';
import { BIG_ZERO } from '../../helpers/big-number';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { css, type CssStyles } from '@repo/styles/css';
import { Tooltip, type TooltipProps } from '../Tooltip';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

const useStyles = legacyMakeStyles(styles);

export type PriceWithChangeProps = {
  oracleId: string;
  css?: CssStyles;
};

export const PriceWithChange = memo(function PriceWithChange({
  oracleId,
  css: cssProp,
}: PriceWithChangeProps) {
  const dispatch = useAppDispatch();
  const { price, bucket, shouldLoad, previousPrice, previousDate } = useAppSelector(state =>
    selectPriceWithChange(state, oracleId, '1h_1d')
  );

  useEffect(() => {
    if (shouldLoad) {
      dispatch(fetchHistoricalPrices({ oracleId, bucket }));
    }
  }, [dispatch, oracleId, bucket, shouldLoad]);

  if (!price || price.isZero()) {
    return null;
  }

  if (!previousPrice || previousPrice.isZero()) {
    return <WithoutChange price={price} css={cssProp} />;
  }

  return (
    <WithChange
      price={price}
      previousPrice={previousPrice}
      previousDate={previousDate}
      css={cssProp}
    />
  );
});

type WithoutChangeProps = {
  price: BigNumber;
  css?: CssStyles;
};

const WithoutChange = memo(function WithoutChange({ price, css: cssProp }: WithoutChangeProps) {
  const classes = useStyles();

  return (
    <div className={css(styles.priceWithChange, cssProp)}>
      <div className={classes.price}>{formatLargeUsd(price)}</div>
    </div>
  );
});

type WithChangeProps = {
  price: BigNumber;
  previousPrice: BigNumber;
  previousDate: Date;
  css?: CssStyles;
};

const WithChange = memo(function WithChange({
  price,
  previousPrice,
  previousDate,
  css: cssProp,
}: WithChangeProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const diff = price.minus(previousPrice);
  const diffAbs = diff.abs();
  const percentChange = diffAbs.div(previousPrice);
  const isPositive = diff.gt(BIG_ZERO);
  const isNegative = diff.lt(BIG_ZERO);
  const tooltipContent = t(`Price-Change-${isPositive ? 'Up' : isNegative ? 'Down' : 'Flat'}`, {
    change: formatUsd(diffAbs, diffAbs.gte(0.01) ? 2 : 4),
    date: format(previousDate, 'MMM d, yyyy h:mm a'),
  });
  const handleTooltipClick = useCallback<Exclude<TooltipProps['onTriggerClick'], undefined>>(e => {
    if (e) {
      // don't bubble up
      e.preventDefault();
    }
  }, []);

  return (
    <Tooltip
      content={tooltipContent}
      onTriggerClick={handleTooltipClick}
      triggerCss={css.raw(styles.priceWithChange, styles.tooltipTrigger, cssProp)}
    >
      <div className={classes.price}>{formatUsd(price, price.gte(0.01) ? 2 : 4)}</div>
      <div
        className={css(styles.change, isPositive && styles.positive, isNegative && styles.negative)}
      >
        <div className={classes.changeValue}>
          {isPositive ? '+' : isNegative ? '-' : ''}
          {formatLargePercent(percentChange, 2)}
        </div>
      </div>
    </Tooltip>
  );
});
