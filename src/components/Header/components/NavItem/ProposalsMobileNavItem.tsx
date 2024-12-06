import { memo, useCallback } from 'react';
import type { NavItemProps } from '../DropNavItem/types';
import { NavItemMobile } from './NavItem';
import { markAllProposalsRead } from '../../../../features/data/actions/proposal';
import { useAppDispatch } from '../../../../store';
import { UnreadProposalsCount } from '../Badges/UnreadProposalsCount';

export const ProposalsMobileNavItem = memo(function ProposalsMobileNavItem({
  url,
  title,
  Icon,
  css: cssProp,
  onClick,
}: NavItemProps) {
  const dispatch = useAppDispatch();
  const markRead = useCallback(() => {
    dispatch(markAllProposalsRead());
    if (onClick) {
      onClick();
    }
  }, [dispatch, onClick]);

  return (
    <NavItemMobile
      url={url}
      title={title}
      Icon={Icon}
      onClick={markRead}
      css={cssProp}
      Badge={UnreadProposalsCount}
    />
  );
});
