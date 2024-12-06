import { memo, useCallback } from 'react';
import type { NavItemProps } from '../DropNavItem/types';
import { NavLinkItem } from './NavLinkItem';
import { markAllProposalsRead } from '../../../../features/data/actions/proposal';
import { useAppDispatch } from '../../../../store';
import { UnreadProposalsCount } from '../Badges/UnreadProposalsCount';

export const ProposalsNavItem = memo<NavItemProps>(function ProposalsNavItem({ onClick, ...rest }) {
  const dispatch = useAppDispatch();
  const markRead = useCallback(() => {
    onClick?.();
    dispatch(markAllProposalsRead());
  }, [dispatch, onClick]);

  return <NavLinkItem onClick={markRead} {...rest} Badge={UnreadProposalsCount} />;
});
