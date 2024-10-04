import { Link, type LinkProps } from 'react-router-dom';
import { memo } from 'react';
import clsx from 'clsx';
import { buttonRecipe, type MakeButtonProps } from './recipe';
import { css } from '@styles/css';

export type ButtonLinkProps = MakeButtonProps<LinkProps>;

export const ButtonLink = memo<ButtonLinkProps>(function ButtonLink({
  children,
  className,
  variant = 'default',
  ...props
}) {
  const [styleProps, rest] = buttonRecipe.splitVariantProps(props);

  return (
    <Link
      {...rest}
      className={clsx(
        css({ colorPalette: `buttons.${variant}` }),
        buttonRecipe(styleProps),
        className
      )}
    >
      {children}
    </Link>
  );
});
