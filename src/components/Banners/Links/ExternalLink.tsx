import { memo } from 'react';
import type { ExternalLinkProps } from './types';
import { baseClass } from './styles';
import { cx } from '@repo/styles/css';

export const ExternalLink = memo<ExternalLinkProps>(function ExternalLink({
  href,
  children,
  className,
}) {
  return (
    <a href={href} target="_blank" rel="noopener" className={cx(baseClass, className)}>
      {children}
    </a>
  );
});
