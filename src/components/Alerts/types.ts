import type { ComponentProps, FC, ReactNode } from 'react';
import type { AlertRecipe } from './styles';
import type {
  RecipeVariantFn,
  RecipeVariantProps,
  RecipeVariantRecord,
  SlotRecipeVariantFn,
  SlotRecipeVariantRecord,
} from '@repo/styles/types';

type RecipeVariantProp<
  T extends
    | RecipeVariantFn<RecipeVariantRecord>
    | SlotRecipeVariantFn<string, SlotRecipeVariantRecord<string>>,
  S extends keyof Exclude<RecipeVariantProps<T>, undefined>
> = Exclude<RecipeVariantProps<T>, undefined>[S];

type RequiredRecipeVariantProp<
  T extends
    | RecipeVariantFn<RecipeVariantRecord>
    | SlotRecipeVariantFn<string, SlotRecipeVariantRecord<string>>,
  S extends keyof Exclude<RecipeVariantProps<T>, undefined>
> = Exclude<RecipeVariantProp<T, S>, undefined>;

export type AlertProps = {
  IconComponent: FC<ComponentProps<'svg'>>;
  children: ReactNode;
  variant: RequiredRecipeVariantProp<AlertRecipe, 'variant'>;
  className?: string;
};

export type AlertVariantProps = Omit<AlertProps, 'IconComponent' | 'variant'>;
