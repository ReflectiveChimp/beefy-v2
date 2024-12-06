import { memo } from 'react';
import { formatTokenDisplay, formatTokenDisplayCondensed } from '../../helpers/format';
import { Tooltip } from '../Tooltip';
import { BasicTooltipContent } from '../Tooltip/BasicTooltipContent';
import type { BigNumber } from 'bignumber.js';
import type { TokenEntity } from '../../features/data/entities/token';
import { styles } from './styles';
import { css, type CssStyles } from '@repo/styles/css';

export type TokenAmountProps = {
  amount: BigNumber;
  decimals: number;
  css?: CssStyles;
  onClick?: () => void;
  disableTooltip?: boolean;
};
export const TokenAmount = memo(function TokenAmount({
  amount,
  decimals,
  css: cssProp,
  onClick,
  disableTooltip,
}: TokenAmountProps) {
  const fullAmount = formatTokenDisplay(amount, decimals);
  const shortAmount = formatTokenDisplayCondensed(amount, decimals);
  const needTooltip = shortAmount.length < fullAmount.length;

  return needTooltip ? (
    disableTooltip ? (
      <span onClick={onClick} className={css(cssProp, onClick && styles.withOnClick)}>
        {shortAmount}
      </span>
    ) : (
      <Tooltip
        onTriggerClick={onClick}
        triggerCss={css.raw(styles.withTooltip, onClick && styles.withOnClick, cssProp)}
        content={<BasicTooltipContent title={fullAmount} />}
      >
        {shortAmount}
      </Tooltip>
    )
  ) : (
    <span onClick={onClick} className={css(cssProp, onClick && styles.withOnClick)}>
      {fullAmount}
    </span>
  );
});

export type TokenAmountFromEntityProps = Omit<TokenAmountProps, 'decimals'> & {
  token: TokenEntity;
};

export const TokenAmountFromEntity = memo(function TokenAmountFromEntity({
  token,
  ...rest
}: TokenAmountFromEntityProps) {
  return <TokenAmount decimals={token.decimals} {...rest} />;
});
