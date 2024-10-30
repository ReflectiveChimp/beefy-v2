import { memo } from 'react';
import { ToggleButtons } from '../../../../components/ToggleButtons';
import { makeStyles, type Theme, useMediaQuery } from '@material-ui/core';
import { styles } from './styles';
import { LabeledSelect } from '../../../../components/LabeledSelect';

const useStyles = makeStyles(styles);

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
  const classes = useStyles();
  const showButtons = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  return showButtons ? (
    <ToggleButtons value={stat} options={options} onChange={onChange} variant="filter" />
  ) : (
    <LabeledSelect
      selectClass={classes.select}
      options={options}
      value={stat}
      onChange={onChange}
    />
  );
});
