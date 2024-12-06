import { memo } from 'react';
import { NotificationDot } from './NotificationDot';
import type { BadgeComponentProps } from './types';
import { useHaveUnreadArticle, useHaveUnreadProposal } from './hooks';

export const UnreadDots = memo(function UnreadDots(props: BadgeComponentProps) {
  const haveUnreadArticle = useHaveUnreadArticle();
  const haveUnreadProposal = useHaveUnreadProposal();

  return haveUnreadArticle || haveUnreadProposal ? <NotificationDot {...props} /> : null;
});

export const UnreadArticleDot = memo(function UnreadArticleDot(props: BadgeComponentProps) {
  const haveUnreadArticle = useHaveUnreadArticle();

  return haveUnreadArticle ? <NotificationDot {...props} /> : null;
});

export const UnreadProposalDot = memo(function UnreadProposalDot(props: BadgeComponentProps) {
  const haveUnreadProposal = useHaveUnreadProposal();

  return haveUnreadProposal ? <NotificationDot {...props} /> : null;
});
