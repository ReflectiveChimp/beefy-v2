import type { SvgIconComponent } from '@material-ui/icons';
import type { ReactNode } from 'react';
import type { AlertRecipe } from './recipe';
import type {
  RecipeVariantFn,
  RecipeVariantProps,
  RecipeVariantRecord,
  SlotRecipeVariantFn,
  SlotRecipeVariantRecord,
} from '@styles/types';

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
  IconComponent: SvgIconComponent;
  children: ReactNode;
  variant: RequiredRecipeVariantProp<AlertRecipe, 'variant'>;
  className?: string;
};

export type AlertVariantProps = Omit<AlertProps, 'IconComponent' | 'variant'>;
