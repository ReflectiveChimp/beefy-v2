import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertError } from '../../../../../../components/Alerts';
import { useAppSelector } from '../../../../../../store';
import {
  selectTransactDepositInputAmountExceedsBalance,
  selectTransactSelectedQuote,
  selectTransactWithdrawInputAmountExceedsBalance,
} from '../../../../../data/selectors/transact';
import { selectIsWalletConnected } from '../../../../../data/selectors/wallet';
import { isCowcentratedDepositQuote } from '../../../../../data/apis/transact/transact-types';
import { BIG_ZERO } from '../../../../../../helpers/big-number';
import { type CssStyles } from '@repo/styles/css';

export type NotEnoughProps = {
  onChange: (shouldDisable: boolean) => void;
  mode: 'deposit' | 'withdraw';
  css?: CssStyles;
};
export const NotEnoughNotice = memo(function NotEnoughNotice({
  onChange,
  css: cssProp,
  mode,
}: NotEnoughProps) {
  const { t } = useTranslation();
  const isWalletConnected = useAppSelector(selectIsWalletConnected);
  const inputAmountExceedsBalance = useAppSelector(
    mode === 'deposit'
      ? selectTransactDepositInputAmountExceedsBalance
      : selectTransactWithdrawInputAmountExceedsBalance
  );
  const quote = useAppSelector(selectTransactSelectedQuote);
  const isInvalidCowcentratedDeposit =
    quote &&
    isCowcentratedDepositQuote(quote) &&
    quote.outputs.every(output => output.amount.lte(BIG_ZERO));

  useEffect(() => {
    onChange(inputAmountExceedsBalance);
  }, [inputAmountExceedsBalance, onChange]);

  if (!inputAmountExceedsBalance || !isWalletConnected || isInvalidCowcentratedDeposit) {
    return null;
  }

  return (
    <AlertError css={cssProp}>
      <p>{t('Transact-Notice-NotEnough')}</p>
    </AlertError>
  );
});
