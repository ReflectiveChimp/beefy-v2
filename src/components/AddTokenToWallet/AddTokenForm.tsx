import { sva } from '@styles/css';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectAddToWalletIconUrl,
  selectAddToWalletToken,
} from '../../features/data/selectors/add-to-wallet';
import { selectChainById } from '../../features/data/selectors/chains';
import {
  selectCurrentChainId,
  selectIsWalletConnected,
} from '../../features/data/selectors/wallet';
import { getWalletConnectionApi } from '../../features/data/apis/instances';
import { askForNetworkChange, askForWalletConnection } from '../../features/data/actions/wallet';
import { CopyText } from './CopyText';
import { Button } from '../Button';

const useAddTokenFormStyles = sva({
  slots: ['details', 'label', 'buttons'],
  base: {
    details: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      textStyle: 'subline-sm',
    },
    buttons: {
      marginTop: '24px',
    },
  },
});

export const AddTokenForm = memo(function AddTokenForm() {
  const classes = useAddTokenFormStyles();
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
      <div className={classes.details}>
        <div className={classes.label}>{t('Token-Symbol')}</div>
        <CopyText value={token.symbol} />
        <div className={classes.label}>{t('Token-Address')}</div>
        <CopyText value={token.address} />
        <div className={classes.label}>{t('Token-Decimals')}</div>
        <CopyText value={token.decimals.toString()} />
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
