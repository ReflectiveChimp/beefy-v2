import { IconButton } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo, useCallback, useRef } from 'react';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../store';
import { Modal } from '../Modal';
import {
  selectAddToWalletError,
  selectAddToWalletIconUrl,
  selectAddToWalletStatus,
  selectAddToWalletToken,
} from '../../features/data/selectors/add-to-wallet';
import { addToWalletActions } from '../../features/data/reducers/add-to-wallet';
import { Card, CardContent, CardHeader, CardTitle } from '../../features/vault/components/Card';
import { ReactComponent as CloseIcon } from '@repo/images/icons/mui/Close.svg';
import { ReactComponent as FileCopy } from '@repo/images/icons/mui/FileCopy.svg';
import { useTranslation } from 'react-i18next';
import { css, type CssStyles } from '@repo/styles/css';
import {
  selectCurrentChainId,
  selectIsWalletConnected,
} from '../../features/data/selectors/wallet';
import { askForNetworkChange, askForWalletConnection } from '../../features/data/actions/wallet';
import { getWalletConnectionApi } from '../../features/data/apis/instances';
import { Button } from '../Button';
import { selectChainById } from '../../features/data/selectors/chains';

const useStyles = legacyMakeStyles(styles);

const Pending = memo(function Pending() {
  return <div>Pending</div>;
});

const Rejected = memo(function Rejected() {
  const error = useAppSelector(selectAddToWalletError);
  return <div>Error: {error?.message || 'unknown error'}</div>;
});

type CopyTextProps = {
  css?: CssStyles;
  value: string;
};

const CopyText = memo(function CopyText({ css: cssProp, value }: CopyTextProps) {
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleCopy = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
    navigator.clipboard.writeText(value).catch(e => console.error(e));
  }, [value, inputRef]);

  return (
    <div className={css(styles.copyText, cssProp)}>
      <input type="text" readOnly className={classes.copyTextInput} value={value} ref={inputRef} />
      <button className={classes.copyTextButton} onClick={handleCopy}>
        <FileCopy />
      </button>
    </div>
  );
});

const Fulfilled = memo(function Fulfilled() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconUrl = useAppSelector(selectAddToWalletIconUrl);
  const token = useAppSelector(selectAddToWalletToken);
  const { symbol, chainId, address, decimals } = token;
  const chain = useAppSelector(state => selectChainById(state, chainId));
  const isWalletConnected = useAppSelector(selectIsWalletConnected);
  const currentChainId = useAppSelector(selectCurrentChainId);
  const isWalletConnectedCorrectChain = isWalletConnected && currentChainId === chainId;

  const handleAddToken = useCallback(() => {
    const perform = async () => {
      const walletApi = await getWalletConnectionApi();
      const web3 = await walletApi.getConnectedWeb3Instance();
      const currentProvider = web3.currentProvider;
      if (
        currentProvider &&
        typeof currentProvider === 'object' &&
        'request' in currentProvider &&
        typeof currentProvider.request === 'function'
      ) {
        await currentProvider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              chainId,
              address,
              symbol,
              decimals,
              image: iconUrl,
            },
          },
        });
      }
    };
    perform().catch(err => console.error(err));
  }, [address, symbol, decimals, iconUrl, chainId]);

  const handleConnect = useCallback(() => {
    if (!isWalletConnected) {
      dispatch(askForWalletConnection());
    }
  }, [dispatch, isWalletConnected]);

  const handleNetworkChange = useCallback(() => {
    dispatch(askForNetworkChange({ chainId }));
  }, [dispatch, chainId]);

  const handleClick = isWalletConnectedCorrectChain
    ? handleAddToken
    : isWalletConnected
    ? handleNetworkChange
    : handleConnect;

  return (
    <>
      <div className={classes.tokenDetails}>
        <div className={classes.tokenLabel}>{t('Token-Symbol')}</div>
        <CopyText css={styles.tokenValue} value={token.symbol} />
        <div className={classes.tokenLabel}>{t('Token-Address')}</div>
        <CopyText css={styles.tokenValue} value={token.address} />
        <div className={classes.tokenLabel}>{t('Token-Decimals')}</div>
        <CopyText css={styles.tokenValue} value={token.decimals.toString()} />
      </div>
      <div className={classes.buttons}>
        <Button variant="success" fullWidth={true} borderless={true} onClick={handleClick}>
          {isWalletConnectedCorrectChain
            ? t('Add-To-Wallet')
            : isWalletConnected
            ? t('Network-Change', { network: chain.name })
            : t('Network-ConnectWallet')}
        </Button>
      </div>
    </>
  );
});

const FulfilledCardTitle = memo(function FulfilledCardTitle() {
  const { t } = useTranslation();
  const classes = useStyles();
  const token = useAppSelector(selectAddToWalletToken);
  const iconUrl = useAppSelector(selectAddToWalletIconUrl);

  return (
    <>
      {iconUrl && <img src={iconUrl} alt={token.symbol} height={32} className={classes.cardIcon} />}
      <CardTitle
        title={t('Add-Token-To-Wallet', { token: token.symbol })}
        titleCss={styles.cardTitle}
      />
    </>
  );
});

const PendingCardTitle = memo(function PendingCardTitle() {
  const { t } = useTranslation();

  return <CardTitle title={t('Add-To-Wallet')} titleCss={styles.cardTitle} />;
});

export const AddTokenToWallet = memo(function AddTokenToWallet() {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const status = useAppSelector(selectAddToWalletStatus);
  const isOpen = status !== 'idle';

  const handleClose = useCallback(() => {
    dispatch(addToWalletActions.close());
  }, [dispatch]);

  return (
    <Modal open={isOpen} onClose={handleClose} tabIndex={-1}>
      {isOpen ? (
        <div className={classes.cardHolder}>
          <Card css={styles.card}>
            <CardHeader css={styles.cardHeader}>
              {status === 'fulfilled' ? <FulfilledCardTitle /> : <PendingCardTitle />}
              <IconButton onClick={handleClose} aria-label="close" className={classes.closeButton}>
                <CloseIcon color="#999CB3" />
              </IconButton>
            </CardHeader>
            <CardContent css={styles.cardContent}>
              {status === 'pending' && <Pending />}
              {status === 'rejected' && <Rejected />}
              {status === 'fulfilled' && <Fulfilled />}
            </CardContent>
          </Card>
        </div>
      ) : (
        <></>
      )}
    </Modal>
  );
});
