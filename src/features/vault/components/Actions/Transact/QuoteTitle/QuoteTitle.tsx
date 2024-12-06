import { memo } from 'react';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { css, type CssStyles } from '@repo/styles/css';
import type { TransactQuote, ZapQuote } from '../../../../../data/apis/transact/transact-types';
import { isZapQuote } from '../../../../../data/apis/transact/transact-types';
import { selectZapQuoteTitle } from '../../../../../data/selectors/zap';
import { useAppSelector } from '../../../../../../store';
import { ProviderIcon } from '../ProviderIcon';

export type QuoteTitleProps = {
  quote: TransactQuote;
  css?: CssStyles;
};
export const QuoteTitle = memo(function QuoteTitle({ quote, css: cssProp }: QuoteTitleProps) {
  const { t } = useTranslation();

  if (isZapQuote(quote)) {
    return <ZapQuoteTitle quote={quote} css={cssProp} />;
  }

  return <div className={css(styles.container, cssProp)}>{t('Transact-QuoteTitle')}</div>;
});

export type ZapQuoteTitleProps = {
  quote: ZapQuote;
  css?: CssStyles;
};
export const ZapQuoteTitle = memo(function ZapQuoteTitle({
  quote,
  css: cssProp,
}: ZapQuoteTitleProps) {
  const { t } = useTranslation();
  const { title, icon } = useAppSelector(state => selectZapQuoteTitle(state, quote.steps, t));

  return (
    <div className={css(styles.container, cssProp)}>
      <ProviderIcon provider={icon} width={24} css={styles.icon} />
      {t(title)}
    </div>
  );
});
