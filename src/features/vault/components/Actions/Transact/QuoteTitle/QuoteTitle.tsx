import React, { memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { TransactQuote, ZapQuote } from '../../../../../data/apis/transact/transact-types';
import {
  isZapQuote,
  isZapQuoteStepSwap,
  isZapQuoteStepSwapAggregator,
  isZapQuoteStepSwapPool,
} from '../../../../../data/apis/transact/transact-types';
import { uniq } from 'lodash-es';
// import { ProviderIcon } from '../ProviderIcon';

const useStyles = makeStyles(styles);

export type QuoteTitleProps = {
  quote: TransactQuote;
  className?: string;
};
export const QuoteTitle = memo<QuoteTitleProps>(function QuoteTitle({ quote, className }) {
  const classes = useStyles();
  const { t } = useTranslation();

  if (isZapQuote(quote)) {
    return <ZapQuoteTitle quote={quote} className={className} />;
  }

  return <div className={clsx(classes.container, className)}>{t('Transact-QuoteTitle')}</div>;
});

export type ZapQuoteTitleProps = {
  quote: ZapQuote;
  className?: string;
};
export const ZapQuoteTitle = memo<ZapQuoteTitleProps>(function ZapQuoteTitle({ quote, className }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { steps } = quote;
  const title = useMemo(() => {
    const defaultTitle = `Transact-Quote-Title`;
    const swapSteps = steps.filter(isZapQuoteStepSwap);
    if (swapSteps.length === 0) {
      return defaultTitle;
    }

    const poolSwaps = swapSteps.filter(isZapQuoteStepSwapPool);
    if (poolSwaps.length > 0) {
      return defaultTitle;
    }

    const aggregatorSwaps = swapSteps
      .filter(isZapQuoteStepSwapAggregator)
      .filter(step => step.providerId !== 'wnative');
    if (aggregatorSwaps.length === 0) {
      return defaultTitle;
    }

    const uniqAggregators = uniq(aggregatorSwaps.map(step => step.providerId));
    if (uniqAggregators.length > 1) {
      return defaultTitle;
    }

    return `Transact-Quote-Title-${uniqAggregators[0]}`;
  }, [steps]);

  return (
    <div className={clsx(classes.container, className)}>
      {/* TODO <ProviderIcon provider={providerId} width={24} className={classes.icon} />*/}
      {t(title)}
    </div>
  );
});
