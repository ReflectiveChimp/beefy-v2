import { memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectTransactInputIndexAmount,
  selectTransactVaultId,
} from '../../../../../data/selectors/transact';
import { selectUserVaultBalanceInDepositTokenWithToken } from '../../../../../data/selectors/balance';
import type { AmountInputProps } from '../AmountInput';
import { transactActions } from '../../../../../data/reducers/wallet/transact';
import { selectTokenPriceByTokenOracleId } from '../../../../../data/selectors/tokens';
import { BigNumber } from 'bignumber.js';
import { AmountInputWithSlider } from '../AmountInputWithSlider';
import { TokenSelectButton } from '../TokenSelectButton';
import { type CssStyles } from '@repo/styles/css';

export type WithdrawTokenAmountInputProps = {
  css?: CssStyles;
};

export const WithdrawTokenAmountInput = memo(function WithdrawTokenAmountInput({
  css: cssProp,
}: WithdrawTokenAmountInputProps) {
  const dispatch = useAppDispatch();

  const vaultId = useAppSelector(selectTransactVaultId);
  const { token: depositToken, amount: userBalance } = useAppSelector(state =>
    selectUserVaultBalanceInDepositTokenWithToken(state, vaultId)
  );
  const value = useAppSelector(state => selectTransactInputIndexAmount(state, 0));
  const price = useAppSelector(state =>
    selectTokenPriceByTokenOracleId(state, depositToken.oracleId)
  );

  const handleChange = useCallback<AmountInputProps['onChange']>(
    (value, isMax) => {
      dispatch(
        transactActions.setInputAmount({
          index: 0,
          amount: value.decimalPlaces(depositToken.decimals, BigNumber.ROUND_FLOOR),
          max: isMax,
        })
      );
    },
    [dispatch, depositToken.decimals]
  ) satisfies AmountInputProps['onChange'];

  return (
    <AmountInputWithSlider
      css={cssProp}
      maxValue={userBalance}
      onChange={handleChange}
      value={value}
      price={price}
      selectedToken={depositToken}
      endAdornment={<TokenSelectButton index={0} />}
    />
  );
});
