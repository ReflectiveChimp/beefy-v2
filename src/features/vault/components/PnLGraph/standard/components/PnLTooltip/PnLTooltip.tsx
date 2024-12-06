import { legacyMakeStyles } from '@repo/helpers/mui';
import { BigNumber } from 'bignumber.js';
import { format } from 'date-fns';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatLargeUsd, formatTokenDisplayCondensed } from '../../../../../../../helpers/format';
import { css } from '@repo/styles/css';

const useStyles = legacyMakeStyles({
  container: css.raw({
    textStyle: 'body',
    color: 'text.white',
    padding: '12px 16px',
    minWidth: '250px',
    background: 'extracted668',
    borderRadius: '8px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }),
  item: css.raw({
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '4px',
  }),
  value: css.raw({
    fontWeight: '500',
  }),
});

// TODO: fix this type
type PayloadData = {
  datetime: string;
  underlyingBalance: string;
  usdBalance: string;
};

interface TooltipProps {
  active?: boolean;
  payload?: {
    payload: PayloadData;
  }[];
}

export const PnLTooltip = memo(function PnLTooltip({ active, payload }: TooltipProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    const formattedDate = format(new Date(payload[0].payload.datetime), 'MMM d, yyyy h:mm a');
    const shares = new BigNumber(payload[0].payload.underlyingBalance);
    const usdBalance = new BigNumber(payload[0].payload.usdBalance);

    return (
      <div className={classes.container}>
        <div>{formattedDate}</div>
        <div className={classes.item}>
          <div>{t('pnl-tooltip-deposit')}</div>
          <div className={classes.value}>{formatTokenDisplayCondensed(shares, 18)}</div>
        </div>
        <div className={classes.item}>
          <div>{t('pnl-tooltip-deposit-usd')}</div>
          <div className={classes.value}>{formatLargeUsd(usdBalance)}</div>
        </div>
      </div>
    );
  }

  return null;
});
