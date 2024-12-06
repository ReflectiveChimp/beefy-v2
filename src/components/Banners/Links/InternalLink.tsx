import { memo } from 'react';
import type { InternalLinkProps } from './types';
import { Link } from 'react-router-dom';
import { baseClass } from './styles';
import { cx } from '@repo/styles/css';

export const InternalLink = memo<InternalLinkProps>(function InternalLink({
  to,
  children,
  className,
}) {
  return (
    <Link to={to} className={cx(baseClass, className)}>
      {children}
    </Link>
  );
});
