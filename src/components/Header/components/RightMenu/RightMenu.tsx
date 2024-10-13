import { memo } from 'react';
import { ReactComponent as BridgeIcon } from '../../../../images/icons/navigation/bridge.svg';
import { ReactComponent as BuyCryptoIcon } from '../../../../images/icons/navigation/buy-crypto.svg';
import { NavLinkItem } from '../NavItem';
import { Prices } from '../Prices';

export const RightMenu = memo(function RightMenu() {
  return (
    <>
      <NavLinkItem title={'Header-BuyCrypto'} url="/onramp" Icon={BuyCryptoIcon} />
      <NavLinkItem title={'Header-BridgeBifi'} url="/bridge" Icon={BridgeIcon} />
      <Prices />
    </>
  );
});
