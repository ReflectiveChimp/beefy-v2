import { Fragment, memo, useCallback, useState } from 'react';
import { ReactComponent as CloseIcon } from '@repo/images/icons/mui/Close.svg';
import { ReactComponent as MenuIcon } from '@repo/images/icons/mui/Menu.svg';
import { NavLinkItem } from '../NavItem';
import { MobileList } from '../../list';
import type { NavConfig, NavDropdownConfig } from '../DropNavItem/types';
import { isNavDropdownConfig } from '../DropNavItem/types';
import { Prices } from '../Prices';
import { UnreadDots } from '../Badges/UnreadDots';
import { Drawer } from '../../../Modal/Drawer';
import { styled } from '@repo/styles/jsx';
import { NavItemInner } from '../NavItem/NavItemInner';
import { NavItem } from '../NavItem/NavLink';

export const MobileMenu = memo(function MobileMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(open => !open);
  }, [setMobileOpen]);

  return (
    <>
      <MenuButton aria-label="menu" onClick={handleDrawerToggle}>
        <MenuIcon fontSize="inherit" />
        <UnreadDots />
      </MenuButton>
      <Drawer scrollable={true} open={mobileOpen} onClose={handleDrawerToggle}>
        <Sidebar>
          <Header>
            <Prices />
            <CloseButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </CloseButton>
          </Header>
          <Divider />
          {MobileList.map(item => {
            return (
              <Fragment key={item.title}>
                <MobileItem item={item} onClick={handleDrawerToggle} />
                <Divider />
              </Fragment>
            );
          })}
        </Sidebar>
      </Drawer>
    </>
  );
});

const Divider = styled('hr', {
  base: {
    height: '2px',
    backgroundColor: 'background.contentDark',
    display: 'block',
    margin: 0,
    padding: 0,
    border: 'none',
  },
});

const MenuButton = styled('button', {
  base: {
    background: 'transparent',
    padding: '3px',
    border: 0,
    boxShadow: 'none',
    color: 'text.primary',
    fontSize: '30px',
    position: 'relative',
  },
});

const Sidebar = styled('div', {
  base: {
    backgroundColor: 'background.header',
    height: 'max-content',
    minHeight: '100vh',
    width: '320px',
  },
});

const Header = styled('div', {
  base: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
});

const CloseButton = styled(
  'button',
  {
    base: {
      marginLeft: 'auto',
      color: 'text.middle',
      _hover: {
        color: 'text.light',
      },
    },
  },
  { defaultProps: { type: 'button' } }
);

type MobileItemProps = {
  item: NavConfig;
  onClick: () => void;
};
const MobileItem = memo<MobileItemProps>(function MobileItem({ item, onClick }) {
  if (isNavDropdownConfig(item)) {
    const NavComponent = item.MobileComponent ?? DropMobile;
    return (
      <NavComponent
        onClick={onClick}
        title={item.title}
        Icon={item.Icon}
        Badge={item.Badge}
        items={item.items}
      />
    );
  }

  const NavComponent = item.MobileComponent ?? NavLinkItem;
  return (
    <NavComponent
      onClick={onClick}
      title={item.title}
      url={item.url}
      Badge={item.Badge}
      Icon={item.Icon}
      exact={item.exact}
      mobile={true}
    />
  );
});

type DropMobileProps = NavDropdownConfig;

export const DropMobile = memo<DropMobileProps>(function DropMobile({
  title,
  Icon,
  items,
  onClick,
  Badge,
}) {
  return (
    <>
      <NavItem mobile={true}>
        <NavItemInner title={title} Icon={Icon} Badge={Badge} />
      </NavItem>
      <SubItems>
        {items.map(item => {
          const NavComponent = item.MobileComponent ?? NavLinkItem;
          return (
            <NavComponent
              key={item.title}
              onClick={onClick}
              title={item.title}
              url={item.url}
              Icon={item.Icon}
              Badge={item.Badge}
              mobile={true}
            />
          );
        })}
      </SubItems>
    </>
  );
});

const SubItems = styled('div', {
  base: {
    paddingLeft: '16px',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '-8px',
    paddingBottom: '8px',
  },
});
