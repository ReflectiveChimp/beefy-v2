import { memo } from 'react';
import type { ExternalLinkProps } from './types';
import clsx from 'clsx';
import { baseClass } from './styles';

export const ExternalLink = memo<ExternalLinkProps>(function ExternalLink({
  href,
  children,
  className,
}) {
  return (
    <a href={href} target="_blank" rel="noopener" className={clsx(baseClass, className)}>
      {children}
    </a>
  );
});
