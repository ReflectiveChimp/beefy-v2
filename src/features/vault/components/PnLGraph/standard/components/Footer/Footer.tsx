import { memo } from 'react';
import { BasicTabs } from '../../../../../../../components/Tabs/BasicTabs';
import type { VaultEntity } from '../../../../../../data/entities/vault';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';

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
  return (
    <div className={css(styles.footer, cssProp)}>
      <div className={css(styles.tabsContainer, tabsCss)}>
        <BasicTabs labels={labels} value={period} onChange={newValue => handlePeriod(newValue)} />
      </div>
    </div>
  );
});
