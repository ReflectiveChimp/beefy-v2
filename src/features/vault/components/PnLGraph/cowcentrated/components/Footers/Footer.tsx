import { makeStyles } from '@material-ui/core';
import { memo, useCallback, useMemo } from 'react';
import type { VaultEntity } from '../../../../../../data/entities/vault';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAppSelector } from '../../../../../../../store';
import { selectCowcentratedLikeVaultDepositTokens } from '../../../../../../data/selectors/tokens';
import { ToggleButtons } from '../../../../../../../components/ToggleButtons';

const useStyles = makeStyles(styles);

interface CommonFooterProps {
  period: number;
  handlePeriod: (period: number) => void;
  labels: string[];
  className?: string;
  tabsClassName?: string;
}

interface OverviewFooterProps extends CommonFooterProps {
  position: boolean;
}

export const OverviewFooter = memo<OverviewFooterProps>(function OverviewFooter({
  period,
  handlePeriod,
  labels,
  className,
  tabsClassName,
  position,
}) {
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
    <div className={clsx(classes.footer, className)}>
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

type FooterProps = CommonFooterProps & {
  vaultId: VaultEntity['id'];
};

export const FeesFooter = memo<FooterProps>(function Footer({
  period,
  handlePeriod,
  labels,
  tabsClassName,
  vaultId,
  className,
}) {
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
    <div className={clsx(classes.footer, className)}>
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
