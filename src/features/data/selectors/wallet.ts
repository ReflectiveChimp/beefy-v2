import { createSelector } from '@reduxjs/toolkit';
import type { BeefyState } from '../../../redux-types';
import { featureFlag_walletAddressOverride } from '../utils/feature-flags';

export const selectWalletAddress = createSelector(
  (state: BeefyState) => state.user.wallet.address,
  address => {
    return address ? featureFlag_walletAddressOverride(address) : undefined;
  }
);

export const selectIsWalletKnown = createSelector(selectWalletAddress, address => !!address);

// If address is actually connected
export const selectIsWalletConnected = createSelector(
  selectWalletAddress,
  (state: BeefyState) => state.user.wallet.connectedAddress,
  (address, connectedAddress) => !!connectedAddress && connectedAddress === address
);

export const selectWalletAddressOrThrow = createSelector(selectWalletAddress, (address): string => {
  if (!address) throw new Error('Wallet address not known');
  return address;
});

// TODO: remove later
export const selectWalletAddressIfKnown = selectWalletAddress;

export const selectCurrentChainId = (state: BeefyState) => state.user.wallet.selectedChainId;
export const selectIsBalanceHidden = (state: BeefyState) => state.user.wallet.hideBalance;
export const selectIsNetworkSupported = (state: BeefyState) =>
  state.user.wallet.error !== 'unsupported chain';
export const selectIsWalletInitialized = (state: BeefyState) => state.user.wallet.initialized;
