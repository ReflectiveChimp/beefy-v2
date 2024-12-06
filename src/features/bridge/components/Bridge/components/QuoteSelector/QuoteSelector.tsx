import { memo, type ReactNode, useCallback, useMemo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectBridgeConfigById,
  selectBridgeFormState,
  selectBridgeIdsFromTo,
  selectBridgeLimitedQuoteById,
  selectBridgeLimitedQuoteIds,
  selectBridgeQuoteById,
  selectBridgeQuoteErrorLimits,
  selectBridgeQuoteIds,
  selectBridgeQuoteSelectedId,
  selectBridgeQuoteStatus,
} from '../../../../../data/selectors/bridge';
import { formatLargeUsd, formatTokenDisplayCondensed } from '../../../../../../helpers/format';
import { bridgeActions } from '../../../../../data/reducers/wallet/bridge';
import { css, type CssStyles } from '@repo/styles/css';
import { getBridgeProviderIcon } from '../../../../../../helpers/bridgeProviderSrc';
import { ReactComponent as Lock } from '@repo/images/icons/mui/Lock.svg';
import { ReactComponent as MonetizationOn } from '@repo/images/icons/mui/MonetizationOn.svg';
import { ReactComponent as Timer } from '@repo/images/icons/mui/Timer.svg';
import { styles } from './styles';
import { TextLoader } from '../../../../../../components/TextLoader';
import type { BeefyAnyBridgeConfig } from '../../../../../data/apis/config-types';
import { AlertError } from '../../../../../../components/Alerts';
import { useTranslation } from 'react-i18next';
import { formatMinutesDuration } from '../../../../../../helpers/date';
import { selectTokenPriceByAddress } from '../../../../../data/selectors/tokens';
import { BigNumber } from 'bignumber.js';

const useStyles = legacyMakeStyles(styles);

type QuoteLimitedProps = {
  quoteId: string;
  css?: CssStyles;
};

const QuoteLimited = memo(function QuoteLimited({ quoteId }: QuoteLimitedProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const quote = useAppSelector(state => selectBridgeLimitedQuoteById(state, quoteId));
  const providerId = quote.config.id;
  const config = useAppSelector(state => selectBridgeConfigById(state, providerId));
  const providerIcon = useMemo(() => {
    return getBridgeProviderIcon(providerId);
  }, [providerId]);
  const limit = useMemo(() => {
    return BigNumber.min(quote.limits.from.current, quote.limits.to.current);
  }, [quote.limits.from, quote.limits.to]);

  return (
    <div className={css(styles.quote, styles.quoteLimited)}>
      <div className={classes.quoteProvider}>
        <img
          src={providerIcon}
          alt={providerId}
          width={24}
          height={24}
          className={classes.quoteProviderIcon}
        />
        <div className={classes.quoteProviderTitle}>{config.title}</div>
      </div>
      <div className={classes.quoteLimit}>
        <Lock className={classes.quoteLimitIcon} />
        <div>
          {t('Bridge-Quote-RateLimited', { amount: formatTokenDisplayCondensed(limit, 18, 6) })}
        </div>
      </div>
    </div>
  );
});

type QuoteButtonProps = {
  quoteId: string;
  selected: boolean;
  css?: CssStyles;
};

const QuoteButton = memo(function QuoteButton({ quoteId, selected }: QuoteButtonProps) {
  const dispatch = useAppDispatch();
  const quote = useAppSelector(state => selectBridgeQuoteById(state, quoteId));
  const handleClick = useCallback(() => {
    if (selected) {
      dispatch(bridgeActions.unselectQuote());
    } else {
      dispatch(bridgeActions.selectQuote({ quoteId: quoteId }));
    }
  }, [quoteId, selected, dispatch]);
  const timeEstimate = useMemo(() => {
    return formatMinutesDuration(quote.timeEstimate);
  }, [quote.timeEstimate]);
  const tokenPrice = useAppSelector(state =>
    selectTokenPriceByAddress(state, quote.fee.token.chainId, quote.fee.token.address)
  );
  const usdFee = useMemo(() => {
    return formatLargeUsd(quote.fee.amount.multipliedBy(tokenPrice));
  }, [tokenPrice, quote.fee.amount]);

  return (
    <button
      onClick={handleClick}
      className={css(styles.quote, styles.quoteButton, selected && styles.quoteButtonSelected)}
    >
      <QuoteButtonInner
        providerId={quote.config.id}
        fee={
          <>
            ~{formatTokenDisplayCondensed(quote.fee.amount, quote.fee.token.decimals, 6)}{' '}
            {quote.fee.token.symbol} ({usdFee})
          </>
        }
        time={<>~{timeEstimate}</>}
      />
    </button>
  );
});

type QuoteButtonInnerProps = {
  providerId: BeefyAnyBridgeConfig['id'];
  fee: ReactNode;
  time: ReactNode;
};
const QuoteButtonInner = memo(function QuoteButtonInner({
  providerId,
  fee,
  time,
}: QuoteButtonInnerProps) {
  const classes = useStyles();
  const config = useAppSelector(state => selectBridgeConfigById(state, providerId));
  const providerIcon = useMemo(() => {
    return getBridgeProviderIcon(providerId);
  }, [providerId]);

  return (
    <>
      <div className={classes.quoteProvider}>
        <img
          src={providerIcon}
          alt={providerId}
          width={24}
          height={24}
          className={classes.quoteProviderIcon}
        />
        <div className={classes.quoteProviderTitle}>{config.title}</div>
      </div>
      <div className={classes.quoteFee}>
        <MonetizationOn className={classes.quoteFeeIcon} />
        <div> {fee} </div>
      </div>
      <div className={classes.quoteTime}>
        <Timer className={classes.quoteTimeIcon} />
        <div>{time}</div>
      </div>
    </>
  );
});

type LoadingQuoteButtonProps = {
  providerId: BeefyAnyBridgeConfig['id'];
};
const LoadingQuoteButton = memo(function LoadingQuoteButton({
  providerId,
}: LoadingQuoteButtonProps) {
  const classes = useStyles();

  return (
    <div className={classes.quote}>
      <QuoteButtonInner
        providerId={providerId}
        fee={<TextLoader placeholder="0.0000 ETH" />}
        time={<TextLoader placeholder="~30m" />}
      />
    </div>
  );
});

const Quotes = memo(function Quotes() {
  const classes = useStyles();
  const ids = useAppSelector(selectBridgeQuoteIds);
  const limitedIds = useAppSelector(selectBridgeLimitedQuoteIds);
  const selectedId = useAppSelector(selectBridgeQuoteSelectedId);

  return (
    <div className={classes.quotes}>
      <>
        {ids.map(id => (
          <QuoteButton quoteId={id} key={id} selected={selectedId === id} />
        ))}
        {limitedIds.map(id => (
          <QuoteLimited quoteId={id} key={id} />
        ))}
      </>
    </div>
  );
});

const QuotesLoading = memo(function QuotesLoading() {
  const classes = useStyles();
  const { from, to } = useAppSelector(selectBridgeFormState);
  const bridgeIds = useAppSelector(state => selectBridgeIdsFromTo(state, from, to));

  return (
    <div className={classes.quotes}>
      {bridgeIds.map(id => (
        <LoadingQuoteButton key={id} providerId={id} />
      ))}
    </div>
  );
});

const QuotesError = memo(function QuotesError() {
  const { t } = useTranslation();
  const errorLimits = useAppSelector(selectBridgeQuoteErrorLimits);

  // Special error if all quotes were rate limited
  if (errorLimits) {
    return (
      <AlertError>
        {t(
          errorLimits.canWait
            ? 'Bridge-Quotes-AllRateLimited-Wait'
            : 'Bridge-Quotes-AllRateLimited',
          {
            current: formatTokenDisplayCondensed(errorLimits.current, 18, 4),
            max: formatTokenDisplayCondensed(errorLimits.max, 18, 4),
          }
        )}
      </AlertError>
    );
  }

  return <AlertError>{t('Bridge-Quotes-Error')}</AlertError>;
});

type QuotesHolderProps = {
  status: 'fulfilled' | 'pending';
};

const QuotesHolder = memo(function QuotesHolder({ status }: QuotesHolderProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.quotesHolder}>
      <div className={classes.quotesTitle}>{t('Bridge-Quotes-Title')}</div>
      {status === 'fulfilled' ? <Quotes /> : <QuotesLoading />}
    </div>
  );
});

type QuoteSelectorProps = {
  css?: CssStyles;
};

export const QuoteSelector = memo(function QuoteSelector({ css: cssProp }: QuoteSelectorProps) {
  const status = useAppSelector(selectBridgeQuoteStatus);

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={css(styles.container, cssProp)}>
      {status === 'rejected' ? <QuotesError /> : <QuotesHolder status={status} />}
    </div>
  );
});
