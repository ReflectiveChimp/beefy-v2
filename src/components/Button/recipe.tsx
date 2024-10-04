import type { ReactNode } from 'react';
import { cva } from '@styles/css';
import type { UtilityValues } from '@styles/types/prop-type';
import type { RecipeVariantProps } from '@styles/types';

export const buttonRecipe = cva({
  base: {
    color: 'colorPalette.color',
    backgroundColor: 'colorPalette.background',
    borderColor: 'colorPalette.border',
    borderRadius: '8px',
    _hover: {
      color: 'colorPalette.hover.color',
      backgroundColor: 'colorPalette.hover.background',
      borderColor: 'colorPalette.hover.border',
    },
    _active: {
      color: 'colorPalette.active.color',
      backgroundColor: 'colorPalette.active.background',
      borderColor: 'colorPalette.active.border',
    },
    _disabled: {
      color: 'colorPalette.disabled.color',
      backgroundColor: 'colorPalette.disabled.background',
      borderColor: 'colorPalette.disabled.border',
      opacity: '0.4',
    },
  },
  variants: {
    size: {
      sm: {
        padding: '8px 16px',
      },
      lg: {
        padding: '12px 24px',
      },
    },
    borderless: {
      false: {
        borderStyle: 'solid',
        borderWidth: '2px',
      },
      true: {},
    },
    fullWidth: {
      false: {},
      true: {
        width: '100%',
      },
    },
    active: {
      false: {},
      true: {},
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      borderless: false,
      css: {
        padding: '6px 14px',
      },
    },
    {
      size: 'lg',
      borderless: false,
      css: {
        padding: '10px 22px',
      },
    },
  ],
  defaultVariants: {
    size: 'lg',
    borderless: false,
    fullWidth: false,
    active: false,
  },
});

type ButtonVariant = {
  [K in UtilityValues['colorPalette']]: K extends `buttons.${string}.${string}`
    ? never
    : K extends `buttons.${infer T}`
    ? T
    : never;
}[UtilityValues['colorPalette']];

type RecipeProps = Exclude<RecipeVariantProps<typeof buttonRecipe>, undefined>;

type BaseProps = {
  children: ReactNode;
  className?: string;
  /** @dev To add a new variant, see panda.config.ts */
  variant?: ButtonVariant;
};

export type MakeButtonProps<T> = T & BaseProps & RecipeProps;
