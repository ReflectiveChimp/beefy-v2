import { legacyMakeStyles } from '@repo/helpers/mui';
import { memo, useCallback, useMemo } from 'react';
import type { VaultEntity } from '../../../../../../data/entities/vault';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { css, type CssStyles } from '@repo/styles/css';
import { useAppSelector } from '../../../../../../../store';
import { selectCowcentratedLikeVaultDepositTokens } from '../../../../../../data/selectors/tokens';
import { ToggleButtons } from '../../../../../../../components/ToggleButtons';

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
