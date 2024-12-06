import { legacyMakeStyles } from '@repo/helpers/mui';
import { css, type CssStyles } from '@repo/styles/css';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { NavLinkProps } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { styles } from './styles';
import { ReactComponent as RightArrow } from '@repo/images/icons/mui/ArrowForwardIosRounded.svg';
import type { NavItemProps } from '../DropNavItem/types';

const useStyles = legacyMakeStyles(styles);

type AutoNavLinkProps = {
  onClick?: NavLinkProps['onClick'];
  activeCss: CssStyles;
  exact: NavLinkProps['exact'];
  to: NavLinkProps['to'];
  children: NavLinkProps['children'];
  css: CssStyles;
};
const AutoNavLink = memo(function AutoNavLink({
  to,
  css: cssProp,
  children,
  onClick,
  ...rest
}: AutoNavLinkProps) {
  const isExternal = typeof to === 'string' && to[0] !== '/';

  if (isExternal) {
    return (
      <a
        className={css(cssProp)}
        href={to}
        target="_blank"
        rel="noopener"
        children={children}
        onClick={onClick}
      />
    );
  }

  return (
    <NavLink className={css(cssProp)} to={to} children={children} onClick={onClick} {...rest} />
  );
});

export const NavItem = memo(function NavItem({
  url,
  title,
  Icon,
  Badge,
  onClick,
  exact = true,
}: NavItemProps) {
  const { t } = useTranslation();
  return (
    <AutoNavLink
      activeCss={styles.active}
      exact={exact}
      css={styles.navLink}
      key={url}
      to={url}
      onClick={onClick}
    >
      <Icon />
      <div className={css(styles.title, !!Badge && styles.titleWithBadge)}>
        {t(title)}
        {Badge ? <Badge /> : null}
      </div>
    </AutoNavLink>
  );
});

type NavItemPropsMobile = NavItemProps;

export const NavItemMobile = memo(function NavItemMobile({
  url,
  title,
  Icon,
  css: cssProp,
  onClick,
  Badge,
  exact = true,
}: NavItemPropsMobile) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <AutoNavLink
      onClick={onClick}
      activeCss={styles.active}
      exact={exact}
      css={css.raw(styles.navLink, styles.itemMobile, cssProp)}
      key={url}
      to={url}
    >
      <div className={classes.flex}>
        <Icon />
        <div className={css(styles.title, !!Badge && styles.titleWithBadge)}>
          {t(title)}
          {Badge ? <Badge /> : null}
        </div>
      </div>
      <RightArrow className={classes.arrow} />
    </AutoNavLink>
  );
});
