import { memo } from 'react';
import type { InternalLinkProps } from './types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { baseClass } from './styles';

export const InternalLink = memo<InternalLinkProps>(function InternalLink({
  to,
  children,
  className,
}) {
  return (
    <Link to={to} className={clsx(baseClass, className)}>
      {children}
    </Link>
  );
});
