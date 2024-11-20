import type { LabeledSelectCommonProps } from '../LabeledSelect';
import type { FC } from 'react';

export type LabeledMultiSelectProps<V extends string = string> = LabeledSelectCommonProps<V> & {
  value: V[];
  /** If provided will insert an all checkbox as first option */
  allLabel?: string;
  allSelectedLabel?: string;
  countSelectedLabel?: string;
  noOptionsMessage?: string;
  onChange: (value: V[]) => void;
  SelectedItemComponent?: FC<SelectedItemProps<V>>;
  DropdownItemComponent?: FC<DropdownItemProps<V | 'all'>>;
  DropdownItemLabelComponent?: FC<DropdownItemLabelProps<V | 'all'>>;
};
export type DropdownItemProps<V extends string = string> = {
  label: string;
  value: V;
  selected: boolean;
  onChange: (value: V) => void;
  className?: string;
  DropdownItemLabelComponent?: FC<DropdownItemLabelProps<V>>;
};
export type DropdownItemLabelProps<V extends string = string> = {
  label: string;
  value: V;
};
export type SelectedItemProps<V extends string = string> = {
  value: LabeledMultiSelectProps<V>['value'];
  options: LabeledMultiSelectProps<V>['options'];
  allSelected: boolean;
  allSelectedLabel: LabeledMultiSelectProps<V>['allSelectedLabel'];
  countSelectedLabel: LabeledMultiSelectProps<V>['countSelectedLabel'];
};
