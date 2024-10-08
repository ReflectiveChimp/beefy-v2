import { IconButton } from '@material-ui/core';
import { memo, useCallback } from 'react';
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
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import { AddTokenForm } from './AddTokenForm';
import { sva } from '@styles/css';

const useStyles = sva({
  slots: ['card', 'cardHeader', 'cardIcon', 'cardTitle', 'closeButton', 'cardContent'],
  base: {
    card: {
      margin: 0,
      outline: 'none',
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '500px',
      maxWidth: '100%',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '18px 24px',
      background: 'background.contentDark',
      borderRadius: '10px 10px 0px 0px ',
      borderBottom: `2px solid {background.border}`,
    },
    cardIcon: {
      marginRight: '8px',
      height: '32px',
    },
    cardTitle: {
      color: 'text.light',
      marginRight: 'auto',
    },
    closeButton: {
      '&:hover': {
        background: 'none',
      },
    },
    cardContent: {
      background: 'background.contentPrimary',
      borderRadius: '0 0 12px 12px',
      padding: '24px',
      minHeight: '200px',
      flexShrink: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  },
});

const Pending = memo(function Pending() {
  return <div>Pending</div>;
});

const Rejected = memo(function Rejected() {
  const error = useAppSelector(selectAddToWalletError);
  return <div>Error: {error?.message || 'unknown error'}</div>;
});

const FulfilledCardTitle = memo(function FulfilledCardTitle() {
  const classes = useStyles();
  const { t } = useTranslation();
  const token = useAppSelector(selectAddToWalletToken);
  const iconUrl = useAppSelector(selectAddToWalletIconUrl);

  return (
    <>
      {iconUrl && <img className={classes.cardIcon} src={iconUrl} alt={token.symbol} height={32} />}
      <CardTitle
        className={classes.cardTitle}
        title={t('Add-Token-To-Wallet', { token: token.symbol })}
      />
    </>
  );
});

const PendingCardTitle = memo(function PendingCardTitle() {
  const classes = useStyles();
  const { t } = useTranslation();

  return <CardTitle className={classes.cardTitle} title={t('Add-To-Wallet')} />;
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
    <Modal open={isOpen} onClose={handleClose}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader}>
          {status === 'fulfilled' ? <FulfilledCardTitle /> : <PendingCardTitle />}
          <IconButton onClick={handleClose} aria-label="close" className={classes.closeButton}>
            <CloseIcon htmlColor="#999CB3" />
          </IconButton>
        </CardHeader>
        <CardContent className={classes.cardContent}>
          {status === 'pending' && <Pending />}
          {status === 'rejected' && <Rejected />}
          {status === 'fulfilled' && <AddTokenForm />}
        </CardContent>
      </Card>
    </Modal>
  );
});
