import type { LabeledMultiSelectProps } from '../LabeledMultiSelect';
import { useMemo } from 'react';
import { simplifySearchText, stringFoundAnywhere } from '../../helpers/string';
import { useMultiSelectSortedOptions } from '../LabeledMultiSelect/hooks';

export function useFilteredSortedOptions(
  options: LabeledMultiSelectProps['options'],
  sort: LabeledMultiSelectProps['sortOptions'],
  inputText: string
) {
  const sortedValues = useMultiSelectSortedOptions(options, sort);
  return useMemo(() => {
    if (inputText.length > 2) {
      return sortedValues.filter(option => {
        if (stringFoundAnywhere(simplifySearchText(option.label), inputText)) {
          return option;
        }
      });
    }
    return sortedValues;
  }, [inputText, sortedValues]);
}
