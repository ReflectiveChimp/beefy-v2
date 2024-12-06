import { memo } from 'react';
import type { ButtonLinkProps } from './types';
import { baseClass } from './styles';
import { cx } from '@repo/styles/css';

export const ButtonLink = memo<ButtonLinkProps>(function ButtonLink({
  onClick,
  children,
  className,
}) {
  return (
    <span onClick={onClick} className={cx(baseClass, className)}>
      {children}
    </span>
  );
});
