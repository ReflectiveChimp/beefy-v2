import { FormControl } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StatLoader } from '../../../StatLoader';
import { useTheme } from '@material-ui/core/styles';
import {
  selectIsBalanceHidden,
  selectIsWalletConnected,
  selectIsWalletKnown,
  selectWalletAddress,
} from '../../../../features/data/selectors/wallet';
import type { BeefyState } from '../../../../redux-types';
import {
  askForWalletConnection,
  doDisconnectWallet,
} from '../../../../features/data/actions/wallet';
import { selectIsWalletPending } from '../../../../features/data/selectors/data-loader';
import { css, cx } from '@repo/styles/css';
import { useAppDispatch } from '../../../../store';
import { formatAddressShort, formatDomain } from '../../../../helpers/format';
import { useResolveAddress } from '../../../../features/data/hooks/resolver';
import { isFulfilledStatus } from '../../../../features/data/reducers/wallet/resolver-types';
import { Fragment } from 'react';

const useStyles = legacyMakeStyles(styles);

export const WalletContainer = connect((state: BeefyState) => {
  const isWalletConnected = selectIsWalletConnected(state);
  const isWalletKnown = selectIsWalletKnown(state);
  const walletAddress = isWalletKnown ? selectWalletAddress(state) : undefined;
  const walletPending = selectIsWalletPending(state);
  const blurred = selectIsBalanceHidden(state);
  return { isWalletConnected, walletAddress, walletPending, blurred };
})(
  ({
    isWalletConnected,
    walletAddress,
    walletPending,
    blurred,
  }: {
    isWalletConnected: boolean;
    walletAddress: undefined | string;
    walletPending: boolean;
    blurred: boolean;
  }) => {
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const resolverStatus = useResolveAddress(walletAddress);

    const handleWalletConnect = () => {
      if (walletAddress) {
        dispatch(doDisconnectWallet());
      } else {
        dispatch(askForWalletConnection());
      }
    };

    const formControlProps = {
      noValidate: true,
      autoComplete: 'off',
      onClick: handleWalletConnect,
    };

    return (
      <div
        className={css(
          styles.container,
          !!walletAddress && styles.known,
          isWalletConnected && styles.connected,
          !walletAddress && styles.disconnected
        )}
      >
        <FormControl {...formControlProps}>
          <div>
            {walletPending && !walletAddress ? (
              <div className={classes.loading}>
                <StatLoader
                  foregroundColor={theme.palette.primary.light}
                  backgroundColor={theme.palette.primary.dark}
                />
              </div>
            ) : (
              <Fragment>
                <div
                  className={cx('wallet-address', css(styles.address, blurred && styles.blurred))}
                >
                  {walletAddress
                    ? isFulfilledStatus(resolverStatus)
                      ? formatDomain(resolverStatus.value)
                      : formatAddressShort(walletAddress)
                    : t('Network-ConnectWallet')}
                </div>
              </Fragment>
            )}
          </div>
        </FormControl>
      </div>
    );
  }
);
