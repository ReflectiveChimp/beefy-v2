import { ClickAwayListener } from '@material-ui/core';
import { css } from '@repo/styles/css';
import type { FC, MouseEventHandler } from 'react';
import { memo, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { Floating } from '../../../Floating';
import { styles } from './styles';
import { NavItem } from '../NavItem';
import type { BadgeComponent } from '../Badges/types';
import type { NavItemConfig } from './types';

interface DropNavItemProps {
  title: string;
  Icon: FC;
  items: NavItemConfig[];
  Badge?: BadgeComponent;
}

export const DropNavItem = memo(function DropNavItem({
  title,
  Icon,
  items,
  Badge,
}: DropNavItemProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef<HTMLDivElement | null>(null);

  const handleToggle = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      e.stopPropagation();
      setIsOpen(open => !open);
    },
    [setIsOpen]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseDown" touchEvent="onTouchStart">
      <div
        onClick={handleToggle}
        className={css(styles.label, isOpen && styles.active)}
        ref={anchorEl}
      >
        <Icon />
        <div className={css(styles.title, !!Badge && styles.titleWithBadge)}>
          {t(title)}
          {Badge ? <Badge /> : null}
        </div>
        <ExpandMore className={css(styles.arrow, isOpen && styles.activeArrow)} />
        <Floating
          open={isOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          css={styles.dropdown}
          display="flex"
          autoWidth={false}
        >
          {items.map(item => {
            const NavItemComponent = item.Component ?? NavItem;
            return (
              <NavItemComponent
                key={item.title}
                title={item.title}
                url={item.url}
                Icon={item.Icon}
                Badge={item.Badge}
              />
            );
          })}
        </Floating>
      </div>
    </ClickAwayListener>
  );
});
