import { memo } from 'react';
import type { NavItemProps } from '../DropNavItem/types';
import { NavLink } from './NavLink';
import { NavItemInner } from './NavItemInner';
import { RightArrow } from './RightArrow';

export const NavLinkItem = memo<NavItemProps>(function NavLinkItem({
  url,
  title,
  Icon,
  Badge,
  onClick,
  exact = true,
  mobile = false,
}) {
  return (
    <NavLink exact={exact} key={url} to={url} onClick={onClick} mobile={mobile}>
      <NavItemInner
        title={title}
        Icon={Icon}
        Badge={Badge}
        Arrow={mobile ? RightArrow : undefined}
      />
    </NavLink>
  );
});
