import { memo } from 'react';
import type { ButtonLinkProps } from './types';
import clsx from 'clsx';
import { baseClass } from './styles';

export const ButtonLink = memo<ButtonLinkProps>(function ButtonLink({
  onClick,
  children,
  className,
}) {
  return (
    <span onClick={onClick} className={clsx(baseClass, className)}>
      {children}
    </span>
  );
});
