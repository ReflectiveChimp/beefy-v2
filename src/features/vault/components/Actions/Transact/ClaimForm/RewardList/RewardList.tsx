import { Fragment, memo, useMemo } from 'react';
import type { BigNumber } from 'bignumber.js';
import type { TokenEntity } from '../../../../../../data/entities/token';
import {
  formatPercent,
  formatTokenDisplayCondensed,
  formatUsd,
} from '../../../../../../../helpers/format';
import { legacyMakeStyles } from '@repo/helpers/mui';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';
import { TokenImageFromEntity } from '../../../../../../../components/TokenImage/TokenImage';
import { orderBy } from 'lodash-es';
import { getNetworkSrc } from '../../../../../../../helpers/networkSrc';
import { Tooltip } from '../../../../../../../components/Tooltip';
import type { ChainEntity } from '../../../../../../data/entities/chain';

const useStyles = legacyMakeStyles(styles);

type Token = Pick<TokenEntity, 'address' | 'symbol' | 'decimals' | 'chainId'>;

type RewardListProps = {
  chainId: ChainEntity['id'];
  css?: CssStyles;
  deposited: boolean;
  rewards: {
    active: boolean;
    amount: BigNumber;
    token: Token;
    price: BigNumber | undefined;
    apr: number | undefined;
  }[];
};

export const RewardList = memo(function RewardList({
  rewards,
  deposited,
  css: cssProp,
  chainId,
}: RewardListProps) {
  const classes = useStyles();
  const sortedRewards = useMemo(
    () => (deposited ? rewards : orderBy(rewards, r => r.apr, 'desc')),
    [rewards, deposited]
  );

  return (
    <div className={css(styles.rewards, cssProp)}>
      {sortedRewards.map(r => (
        <Fragment key={r.token.address}>
          <div className={classes.icon}>
            <TokenImageFromEntity token={r.token} size={24} />
          </div>
          <div className={classes.amount}>
            {r.active && r.amount.isZero()
              ? deposited
                ? 'Earning'
                : 'Earn'
              : formatTokenDisplayCondensed(r.amount, r.token.decimals)}
            {` ${r.token.symbol}`}
            {r.token.chainId !== chainId ? (
              <>
                {' '}
                on{' '}
                <Tooltip
                  content={`${r.token.symbol} rewards are claimable on ${
                    r.token.chainId.charAt(0).toUpperCase() + r.token.chainId.slice(1)
                  }`}
                >
                  <img
                    src={getNetworkSrc(r.token.chainId)}
                    alt={r.token.chainId}
                    height={24}
                    width={24}
                  />
                </Tooltip>
              </>
            ) : null}
          </div>
          <div className={classes.value}>
            {r.active && r.amount.isZero() && r.apr
              ? formatPercent(r.apr)
              : !r.amount.isZero() && r.price
              ? formatUsd(r.price.multipliedBy(r.amount))
              : '-'}
          </div>
        </Fragment>
      ))}
    </div>
  );
});
