import { memo } from 'react';
import { useAppSelector } from '../../../../store';
import { selectTokenPriceByTokenOracleId } from '../../../../features/data/selectors/tokens';
import { Icon } from './Icon';
import { formatLargeUsd } from '../../../../helpers/format';
import { ActionLink } from './Action';
import llamaSwapIcon from '../../../../images/icons/llama-swap.png';
import { AddToWalletButton } from './AddToWalletButton';
import { css } from '@repo/styles/css';
import { type Token, tokens } from './config';

export const Tokens = memo(function Tokens() {
  const className = css({
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'auto 1fr min-content min-content min-content min-content',
    alignItems: 'center',
  });

  return (
    <div className={className}>
      {tokens.map((token, i) => (
        <TokenRow key={i} token={token} />
      ))}
    </div>
  );
});

type TooltipTokenProps = {
  token: Token;
};

const TokenRow = memo<TooltipTokenProps>(function TokenRow({ token }) {
  const { symbol, oracleId, icon, explorer, llamaSwapUrl, address, walletIconUrl, chainId } = token;
  const price = useAppSelector(state => selectTokenPriceByTokenOracleId(state, oracleId));

  return (
    <>
      <Icon alt={symbol} src={icon} first />
      <div>{symbol}</div>
      <div>{formatLargeUsd(price, { decimalsUnder: 2 })}</div>
      <ActionLink href={explorer.url} title={`View at ${explorer.name}`}>
        <Icon alt={explorer.name} src={explorer.icon} />
      </ActionLink>
      {llamaSwapUrl ? (
        <ActionLink href={llamaSwapUrl} title={`Buy via LlamaSwap`}>
          <Icon alt={'LlamaSwap'} src={llamaSwapIcon} />
        </ActionLink>
      ) : null}
      <AddToWalletButton
        title={`Add to Wallet`}
        chainId={chainId}
        tokenAddress={address}
        customIconUrl={walletIconUrl}
      />
    </>
  );
});
