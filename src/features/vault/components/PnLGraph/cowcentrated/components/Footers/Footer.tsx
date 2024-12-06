import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo } from 'react';
import { BasicTabs } from '../../../../../../../components/Tabs/BasicTabs';
import type { VaultEntity } from '../../../../../../data/entities/vault';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { css, type CssStyles } from '@repo/styles/css';
import { useAppSelector } from '../../../../../../../store';
import { selectCowcentratedLikeVaultDepositTokens } from '../../../../../../data/selectors/tokens';

const useStyles = legacyMakeStyles(styles);

interface CommonFooterProps {
  period: number;
  handlePeriod: (period: number) => void;
  labels: string[];
  css?: CssStyles;
  tabsCss?: CssStyles;
}

interface OverviewFooterProps extends CommonFooterProps {
  position: boolean;
}

export const OverviewFooter = memo(function OverviewFooter({
  period,
  handlePeriod,
  labels,
  css: cssProp,
  tabsCss,
  position,
}: OverviewFooterProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={css(styles.footer, cssProp)}>
      <div className={classes.legendContainer}>
        {position ? (
          <div className={classes.legendItem}>
            <div className={classes.positionReferenceLine} />
            {t('Position')}
          </div>
        ) : null}
        <div className={classes.legendItem}>
          <div className={classes.usdReferenceLine} />
          {t('Position Value')}
        </div>
        <div className={classes.legendItem}>
          <div className={classes.holdReferenceLine} />
          {t('HOLD Value')}
        </div>
      </div>
      <div className={css(styles.tabsContainer, tabsCss)}>
        <BasicTabs
          onChange={(newValue: number) => handlePeriod(newValue)}
          labels={labels}
          value={period}
        />
      </div>
    </div>
  );
});

type FooterProps = CommonFooterProps & {
  vaultId: VaultEntity['id'];
};

export const FeesFooter = memo(function Footer({
  period,
  handlePeriod,
  labels,
  tabsCss,
  vaultId,
  css: cssProp,
}: FooterProps) {
  const classes = useStyles();
  const [token0, token1] = useAppSelector(state =>
    selectCowcentratedLikeVaultDepositTokens(state, vaultId)
  );

  return (
    <div className={css(styles.footer, cssProp)}>
      <div className={classes.legendContainer}>
        <div className={classes.legendItem}>
          <div className={classes.usdReferenceLine} />
          {token0.symbol}
        </div>
        <div className={classes.legendItem}>
          <div className={classes.token1ReferenceLine} />
          {token1.symbol}
        </div>
      </div>
      <div className={css(styles.tabsContainer, tabsCss)}>
        <BasicTabs
          onChange={(newValue: number) => handlePeriod(newValue)}
          labels={labels}
          value={period}
        />
      </div>
    </div>
  );
});
