import { makeStyles } from '@material-ui/core';
import { memo, useCallback, useMemo } from 'react';
import type { VaultEntity } from '../../../../../../data/entities/vault';

import { styles } from './styles';
import clsx from 'clsx';
import { ToggleButtons } from '../../../../../../../components/ToggleButtons';

const useStyles = makeStyles(styles);

interface FooterProps {
  period: number;
  handlePeriod: (period: number) => void;
  vaultId: VaultEntity['id'];
  labels: string[];
  tabsClassName?: string;
  className?: string;
}

export const Footer = memo<FooterProps>(function Footer({
  period,
  handlePeriod,
  labels,
  tabsClassName,
  className,
}) {
  const classes = useStyles();
  const options: Record<string, string> = useMemo(() => {
    return Object.fromEntries(labels.map((label, index) => [index, label]));
  }, [labels]);
  const handleChange = useCallback(
    (newValue: string) => {
      handlePeriod(Number(newValue));
    },
    [handlePeriod]
  );

  return (
    <div className={clsx(classes.footer, className)}>
      <div className={clsx(classes.tabsContainer, tabsClassName)}>
        <ToggleButtons
          value={period.toString()}
          options={options}
          onChange={handleChange}
          noBackground={true}
          noPadding={true}
          variant="range"
        />
      </div>
    </div>
  );
});
