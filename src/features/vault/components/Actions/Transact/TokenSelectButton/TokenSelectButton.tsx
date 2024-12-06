import { memo, useCallback, useMemo } from 'react';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectTransactForceSelection,
  selectTransactNumTokens,
  selectTransactOptionsMode,
  selectTransactSelected,
  selectTransactVaultId,
} from '../../../../../data/selectors/transact';
import { transactActions } from '../../../../../data/reducers/wallet/transact';
import { css, type CssStyles } from '@repo/styles/css';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { TokenImage, TokensImage } from '../../../../../../components/TokenImage/TokenImage';
import { TransactMode, TransactStep } from '../../../../../data/reducers/wallet/transact-types';
import zapIcon from '../../../../../../images/icons/zap.svg';
import { useTranslation } from 'react-i18next';
import { selectVaultById } from '../../../../../data/selectors/vaults';
import type { TokenEntity } from '../../../../../data/entities/token';
import { AssetsImage } from '../../../../../../components/AssetsImage';

const useStyles = legacyMakeStyles(styles);

export type TokenSelectButtonProps = {
  index: number;
  css?: CssStyles;
};

export const TokenSelectButton = memo(function TokenSelectButton({
  index,
  css: cssProp,
}: TokenSelectButtonProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const selection = useAppSelector(selectTransactSelected);
  const vaultId = useAppSelector(selectTransactVaultId);
  const vault = useAppSelector(state => selectVaultById(state, vaultId));
  const numTokenOptions = useAppSelector(selectTransactNumTokens);
  const forceSelection = useAppSelector(selectTransactForceSelection);
  const mode = useAppSelector(selectTransactOptionsMode);
  const canSwitchToTokenSelect = index === 0 && numTokenOptions > 1;

  const handleClick = useCallback(() => {
    dispatch(transactActions.switchStep(TransactStep.TokenSelect));
  }, [dispatch]);

  const tokenSymbol = useMemo(() => {
    return vault.assetIds.length > 1 &&
      vault.depositTokenAddress === selection.tokens[index].address
      ? 'LP'
      : selection.tokens[index].symbol;
  }, [selection.tokens, vault.assetIds.length, vault.depositTokenAddress, index]);

  const isBreakLp = useMemo(() => {
    return mode === TransactMode.Withdraw && selection.tokens.length > 1;
  }, [mode, selection.tokens.length]);

  const isMultiDeposit = useMemo(() => {
    return mode === TransactMode.Deposit && selection.tokens.length > 1;
  }, [mode, selection.tokens.length]);

  return (
    <button
      onClick={canSwitchToTokenSelect ? handleClick : undefined}
      className={css(styles.button, cssProp, canSwitchToTokenSelect && styles.buttonMore)}
    >
      {forceSelection ? (
        <div className={css(styles.select, styles.forceSelection)}>
          <div className={classes.zapIcon}>
            <img src={zapIcon} alt="zap" />
          </div>
          {t('Select')}
        </div>
      ) : isBreakLp ? (
        <BreakLp tokens={selection.tokens} />
      ) : (
        <div className={classes.select}>
          <TokensImage
            tokens={isMultiDeposit ? [selection.tokens[index]] : selection.tokens}
            css={styles.iconAssets}
            size={24}
          />
          {tokenSymbol}
        </div>
      )}
      {canSwitchToTokenSelect ? <ExpandMore className={classes.iconMore} /> : null}
    </button>
  );
});

const BreakLp = memo(function BreakLp({ tokens }: { tokens: TokenEntity[] }) {
  const classes = useStyles();
  if (tokens.length === 2) {
    const [token0, token1] = tokens;
    return (
      <div className={classes.breakLp}>
        <TokenImage tokenAddress={token0.address} chainId={token0.chainId} size={16} />
        +
        <TokenImage tokenAddress={token1.address} chainId={token1.chainId} size={16} />
      </div>
    );
  }

  return (
    <div className={classes.breakLp}>
      <AssetsImage assetSymbols={tokens.map(t => t.symbol)} chainId={tokens[0].chainId} size={16} />
    </div>
  );
});
