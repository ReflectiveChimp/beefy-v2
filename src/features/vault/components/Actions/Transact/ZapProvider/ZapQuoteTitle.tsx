import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
// import { ProviderIcon } from '../ProviderIcon';

const useStyles = makeStyles(styles);

export type ZapQuoteTitleProps = {
  index: number;
  className?: string;
};
export const ZapQuoteTitle = memo<ZapQuoteTitleProps>(function ZapQuoteTitle({ index, className }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const quoteNumber = index + 1;

  return (
    <div className={clsx(classes.container, className)}>
      {/* TODO <ProviderIcon provider={providerId} width={24} className={classes.icon} />*/}
      {t(`Transact-QuoteTitle-${quoteNumber}`)}
    </div>
  );
});
