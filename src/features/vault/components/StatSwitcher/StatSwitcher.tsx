import { memo } from 'react';
import { ToggleButtons } from '../../../../components/ToggleButtons';
import { styles } from './styles';
import { LabeledSelect } from '../../../../components/LabeledSelect';
import { useBreakpoint } from '../../../../components/MediaQueries/useBreakpoint';

export type StatSwitcherProps<T extends string = string> = {
  options: Record<T, string>;
  stat: T;
  onChange: (newStat: T) => void;
};

export const StatSwitcher = memo(function StatSwitcher<T extends string = string>({
  options,
  onChange,
  stat,
}: StatSwitcherProps<T>) {
  const mobileView = useBreakpoint({ to: 'xs' });

  return (
    <>
      {mobileView ? (
        <>
          <LabeledSelect
            selectCss={styles.select}
            options={options}
            value={stat}
            onChange={onChange}
          />
        </>
      ) : (
        <ToggleButtons value={stat} options={options} onChange={onChange} variant="filter" />
      )}
    </>
  );
});
