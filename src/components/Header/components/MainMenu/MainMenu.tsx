import { NavLinkItem } from '../NavItem';
import { DropNavItem } from '../DropNavItem';
import { DaoNavItems, ResourcesNavItems } from '../../list';
import { UnreadArticleDot, UnreadProposalDot } from '../Badges/UnreadDots';
import { memo } from 'react';
import { ReactComponent as VaultsIcon } from '../../../../images/icons/navigation/vault.svg';
import { ReactComponent as DashboardIcon } from '../../../../images/icons/navigation/dashboard.svg';
import { ReactComponent as DaoIcon } from '../../../../images/icons/navigation/dao.svg';
import { ReactComponent as ResourcesIcon } from '../../../../images/icons/navigation/resources.svg';
import { NewBadge } from '../Badges/NewBadge';

export const MainMenu = memo(function MainMenu() {
  return (
    <>
      <NavLinkItem title={'Header-Vaults'} url="/" Icon={VaultsIcon} />
      <NavLinkItem
        exact={false}
        title={'Header-Dashboard'}
        url="/dashboard"
        Icon={DashboardIcon}
        Badge={NewBadge}
      />
      <DropNavItem
        title={'Header-Dao'}
        Icon={DaoIcon}
        items={DaoNavItems}
        Badge={UnreadProposalDot}
      />
      <DropNavItem
        title={'Header-Resources'}
        Icon={ResourcesIcon}
        items={ResourcesNavItems}
        Badge={UnreadArticleDot}
      />
    </>
  );
});
