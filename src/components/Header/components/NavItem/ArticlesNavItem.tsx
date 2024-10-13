import { memo, useCallback } from 'react';
import type { NavItemProps } from '../DropNavItem/types';
import { NavLinkItem } from './NavLinkItem';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { UnreadArticleDot } from '../Badges/UnreadDots';
import { selectLastArticle } from '../../../../features/data/selectors/articles';
import { articlesActions } from '../../../../features/data/reducers/articles';

export const ArticlesNavItem = memo<NavItemProps>(function ArticlesNavItem({ onClick, ...rest }) {
  const lastArticle = useAppSelector(selectLastArticle);
  const dispatch = useAppDispatch();
  const markRead = useCallback(() => {
    onClick?.();
    if (lastArticle) {
      dispatch(articlesActions.setLastReadArticleId(lastArticle.id));
    }
  }, [dispatch, lastArticle, onClick]);

  return <NavLinkItem onClick={markRead} {...rest} Badge={UnreadArticleDot} />;
});
