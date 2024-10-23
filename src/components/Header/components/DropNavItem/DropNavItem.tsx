import { type FC, type FunctionComponent, memo, type SVGProps, useCallback, useState } from 'react';
import { ReactComponent as ExpandMore } from '@repo/images/icons/mui/ExpandMore.svg';
import { NavLinkItem } from '../NavItem';
import type { BadgeComponent } from '../Badges/types';
import type { NavItemConfig } from './types';
import { DropdownNavButton } from '../NavItem/NavLink';
import { styled } from '@repo/styles/jsx';
import type { RecipeVariantRecord } from '@repo/styles/types';
import { FloatingDropdown } from '../../../Floating/FloatingDropdown';
import { FloatingProvider } from '../../../Floating/FloatingProvider';
import { NavItemInner } from '../NavItem/NavItemInner';

interface DropNavItemProps {
  title: string;
  Icon: FC;
  items: NavItemConfig[];
  Badge?: BadgeComponent;
}

export const DropNavItem = memo<DropNavItemProps>(function DropNavItem({
  title,
  Icon,
  items,
  Badge,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen(open => !open);
  }, [setIsOpen]);

  return (
    <FloatingProvider open={isOpen} onChange={setIsOpen} hover={true}>
      <DropdownNavButton onClick={handleToggle}>
        <NavItemInner title={title} Icon={Icon} Badge={Badge} Arrow={DownArrow} />
      </DropdownNavButton>
      <DropdownItems>
        {items.map(item => {
          const NavItemComponent = item.Component ?? NavLinkItem;
          return (
            <NavItemComponent
              key={item.title}
              title={item.title}
              url={item.url}
              Icon={item.Icon}
              Badge={item.Badge}
              onClick={handleClose}
            />
          );
        })}
      </DropdownItems>
    </FloatingProvider>
  );
});

const DropdownItems = styled(FloatingDropdown, {
  base: {
    zIndex: 'dropdown',
    display: 'flex',
    flexDirection: 'column' as const,
    rowGap: '12px',
    padding: `8px`,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'background.contentDark',
    backgroundColor: 'searchInput.background',
    borderRadius: '4px',
    marginLeft: '-8px',
  },
});

const DownArrow = styled<FunctionComponent<SVGProps<SVGSVGElement>>, RecipeVariantRecord>(
  ExpandMore,
  {
    base: {
      fontSize: '18px',
    },
  }
);
