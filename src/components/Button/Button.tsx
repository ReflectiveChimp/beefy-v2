import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { forwardRef, memo } from 'react';
import clsx from 'clsx';
import { css } from '@styles/css';
import { buttonRecipe, type MakeButtonProps } from './recipe';

type ButtonElementProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export type ButtonProps = MakeButtonProps<ButtonElementProps>;

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { children, className, variant = 'default', ...props },
    ref
  ) {
    const [styleProps, rest] = buttonRecipe.splitVariantProps(props);
    return (
      <button
        {...rest}
        ref={ref}
        className={clsx(
          css({ colorPalette: `buttons.${variant}` }),
          buttonRecipe(styleProps),
          className
        )}
      >
        {children}
      </button>
    );
  })
);
