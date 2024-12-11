import { memo, useCallback, useMemo } from 'react';
import type { VaultEntity } from '../../../../../../data/entities/vault';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { ToggleButtons } from '../../../../../../../components/ToggleButtons';

interface FooterProps {
  period: number;
  handlePeriod: (period: number) => void;
  vaultId: VaultEntity['id'];
  labels: string[];
  tabsCss?: CssStyles;
  css?: CssStyles;
}

export const Footer = memo(function Footer({
  period,
  handlePeriod,
  labels,
  tabsCss,
  css: cssProp,
}: FooterProps) {
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
    <div className={css(styles.footer, cssProp)}>
      <div className={css(styles.tabsContainer, tabsCss)}>
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
