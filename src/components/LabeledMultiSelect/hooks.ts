import type { LabeledMultiSelectProps } from './types';
import { useMemo } from 'react';
import { entries } from '../../helpers/object';
import { sortBy } from 'lodash-es';

export function useMultiSelectSortedOptions<V extends string = string>(
  options: LabeledMultiSelectProps<V>['options'],
  sort: LabeledMultiSelectProps<V>['sortOptions']
) {
  return useMemo(() => {
    const values = entries(options as Record<V, string>).map(([value, label]) => ({
      value,
      label,
    }));
    return sort !== 'default' && sort !== undefined
      ? sortBy(values, value => value[sort].toLowerCase())
      : values;
  }, [options, sort]);
}
