import { Fragment, memo, useState } from 'react';
import { Divider, Drawer } from '@material-ui/core';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { ReactComponent as Close } from '@repo/images/icons/mui/Close.svg';
import { ReactComponent as Menu } from '@repo/images/icons/mui/Menu.svg';
import { styles } from './styles';
// import { BifiPrice } from '../BifiPrice';
import { NavItemMobile } from '../NavItem';
import { useTranslation } from 'react-i18next';
import { MobileList } from '../../list';
import type { NavConfig, NavDropdownConfig } from '../DropNavItem/types';
import { isNavDropdownConfig } from '../DropNavItem/types';
import { css } from '@repo/styles/css';
import { Prices } from '../Prices';
import { UnreadDots } from '../Badges/UnreadDots';

const useStyles = legacyMakeStyles(styles);

export const MobileMenu = memo(function MobileMenu() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <div>
      <button aria-label="menu" onClick={handleDrawerToggle} className={classes.toggleDrawer}>
        <Menu fontSize="inherit" className={classes.toggleDrawerIcon} />
        <UnreadDots />
      </button>
      <Drawer className={classes.bg} anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <div className={classes.menuContainer}>
          <div className={classes.head}>
            <div className={classes.flex}>
              <Prices />
            </div>
            <Close className={classes.cross} onClick={handleDrawerToggle} />
          </div>
          <Divider className={classes.divider} />
          {MobileList.map(item => {
            return (
              <Fragment key={item.title}>
                <MobileItem item={item} onClick={handleDrawerToggle} />
                <Divider className={classes.divider} />
              </Fragment>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
});

type MobileItemProps = {
  item: NavConfig;
  onClick: () => void;
};
const MobileItem = memo(function MobileItem({ item, onClick }: MobileItemProps) {
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

  const NavComponent = item.MobileComponent ?? NavItemMobile;
  return (
    <NavComponent
      onClick={onClick}
      title={item.title}
      url={item.url}
      Badge={item.Badge}
      Icon={item.Icon}
      exact={item.exact}
    />
  );
});

type DropMobileProps = NavDropdownConfig;

export const DropMobile = memo(function DropMobile({
  title,
  Icon,
  items,
  onClick,
  Badge,
}: DropMobileProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.itemsContainer}>
      <div className={classes.itemTitle}>
        <Icon />
        <div className={css(styles.title, !!Badge && styles.titleWithBadge)}>
          {t(title)}
          {Badge ? <Badge /> : null}
        </div>
      </div>
      <div>
        {items.map(item => {
          const NavComponent = item.MobileComponent ?? NavItemMobile;
          return (
            <NavComponent
              key={item.title}
              onClick={onClick}
              css={styles.customPadding}
              title={item.title}
              url={item.url}
              Icon={item.Icon}
              Badge={item.Badge}
            />
          );
        })}
      </div>
    </div>
  );
});
