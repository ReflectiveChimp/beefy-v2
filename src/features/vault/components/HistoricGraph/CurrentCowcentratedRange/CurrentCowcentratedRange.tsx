import { formatTokenDisplayCondensed } from '../../../../../helpers/format';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { useAppSelector } from '../../../../../store';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  selectCowcentratedLikeVaultDepositTokens,
  selectCurrentCowcentratedRangesByVaultId,
} from '../../../../data/selectors/tokens';
import type { VaultEntity } from '../../../../data/entities/vault';
import { styles } from './styles';
import { BIG_ONE, BIG_ZERO } from '../../../../../helpers/big-number';
import type { CurrentCowcentratedRangeData } from '../../../../data/entities/token';
import { type BigNumber } from 'bignumber.js';
import { Button } from '../../../../../components/Button';
import { ReactComponent as SwapIcon } from '../../../../../images/icons/swap.svg';
import { useBreakpoint } from '../../../../../components/MediaQueries/useBreakpoint';

const useStyles = legacyMakeStyles(styles);

type CurrentCowcentratedRangeIfAvailableProps = {
  vaultId: VaultEntity['id'];
  inverted: boolean;
  toggleInverted: () => void;
};

export const CurrentCowcentratedRangeIfAvailable = memo(function CowcentratedRangesIfAvailable({
  vaultId,
  inverted,
  toggleInverted,
}: CurrentCowcentratedRangeIfAvailableProps) {
  const range = useAppSelector(state => selectCurrentCowcentratedRangesByVaultId(state, vaultId));
  if (
    !range ||
    range.currentPrice.eq(BIG_ZERO) ||
    range.priceRangeMax.eq(BIG_ZERO) ||
    range.priceRangeMin.eq(BIG_ZERO)
  ) {
    return null;
  }

  return (
    <CurrentCowcentratedRange
      inverted={inverted}
      toggleInverted={toggleInverted}
      vaultId={vaultId}
      range={range}
    />
  );
});

function convertRange(range: BigNumber) {
  return BIG_ONE.dividedBy(range);
}

function convertRanges(min: BigNumber, current: BigNumber, max: BigNumber, inverted: boolean) {
  if (inverted) {
    const minRange = convertRange(min);
    const currentRange = convertRange(current);
    const maxRange = convertRange(max);

    return {
      minRange,
      currentRange,
      maxRange,
    };
  } else {
    return {
      minRange: min,
      currentRange: current,
      maxRange: max,
    };
  }
}

type CurrentCowcentratedRangeProps = {
  vaultId: VaultEntity['id'];
  range: CurrentCowcentratedRangeData;
  inverted: boolean;
  toggleInverted: () => void;
};

export const CurrentCowcentratedRange = memo(function CowcentratedRanges({
  vaultId,
  range,
  inverted,
  toggleInverted,
}: CurrentCowcentratedRangeProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { currentPrice, priceRangeMin, priceRangeMax } = range;
  const tokens = useAppSelector(state => selectCowcentratedLikeVaultDepositTokens(state, vaultId));
  const priceString = useMemo(() => {
    const symbols = tokens.map(t => t.symbol);
    return `${symbols[inverted ? 0 : 1]}/${symbols[inverted ? 1 : 0]}`;
  }, [tokens, inverted]);
  const showInRange = useMemo(() => {
    return currentPrice.lte(priceRangeMax) && currentPrice.gte(priceRangeMin);
  }, [currentPrice, priceRangeMax, priceRangeMin]);

  const isMobile = useBreakpoint({ to: 'xs' });

  const { minRange, currentRange, maxRange } = useMemo(() => {
    return convertRanges(priceRangeMin, currentPrice, priceRangeMax, inverted);
  }, [currentPrice, inverted, priceRangeMax, priceRangeMin]);

  return (
    <div className={classes.cowcentratedHeader}>
      <div className={classes.cowcentratedStat}>
        <div className={classes.label}>{t('Min Price')}</div>
        <div className={classes.value}>
          {formatTokenDisplayCondensed(minRange, 18)} <span>{priceString}</span>
        </div>
        {isMobile && (
          <div className={classes.inverted}>
            <Button css={styles.invertButton} onClick={toggleInverted}>
              <SwapIcon height={24} />
            </Button>
          </div>
        )}
      </div>
      <div className={classes.cowcentratedStat}>
        <div className={classes.label}>
          {t('Current Price')}{' '}
          <span className={showInRange ? classes.inRange : classes.outOfRange}>
            ({t(showInRange ? 'In Range' : 'Out of Range')})
          </span>
        </div>
        <div className={classes.value}>
          {formatTokenDisplayCondensed(currentRange, 18)} <span>{priceString}</span>
        </div>
      </div>
      <div className={classes.cowcentratedStat}>
        <div className={classes.label}>{t('Max Price')}</div>
        <div className={classes.value}>
          {formatTokenDisplayCondensed(maxRange, 18)} <span>{priceString}</span>
        </div>
        {!isMobile && (
          <div className={classes.inverted}>
            <Button css={styles.invertButton} onClick={toggleInverted}>
              <SwapIcon height={24} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});
