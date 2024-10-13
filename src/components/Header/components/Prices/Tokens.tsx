import { memo } from 'react';
import { useAppSelector } from '../../../../store';
import { selectTokenPriceByTokenOracleId } from '../../../../features/data/selectors/tokens';
import { Icon } from './Icon';
import { formatLargeUsd } from '../../../../helpers/format';
import { ActionLink } from './Action';
import llamaSwapIcon from '../../../../images/icons/llama-swap.png';
import { AddToWalletButton } from './AddToWalletButton';
import type { ChainEntity } from '../../../../features/data/entities/chain';
import bifiIcon from '../../../../images/single-assets/BIFI.png';
import ethIcon from '../../../../images/networks/ethereum.svg';
import mooIcon from '../../../../images/single-assets/mooBIFI.png';
import opIcon from '../../../../images/networks/optimism.svg';
import baseIcon from '../../../../images/networks/base.svg';
import { css } from '@styles/css';

export type Token = {
  symbol: string;
  address: string;
  oracleId: string;
  chainId: ChainEntity['id'];
  icon: string;
  explorer: {
    name: string;
    icon: string;
    url: string;
  };
  walletIconUrl: string;
  llamaSwapUrl?: string;
};

export const tokens: Token[] = [
  {
    symbol: 'BIFI',
    address: '0xB1F1ee126e9c96231Cc3d3fAD7C08b4cf873b1f1',
    oracleId: 'BIFI',
    chainId: 'ethereum',
    icon: bifiIcon,
    explorer: {
      name: 'Etherscan',
      icon: ethIcon,
      url: 'https://etherscan.io/token/0xB1F1ee126e9c96231Cc3d3fAD7C08b4cf873b1f1',
    },
    walletIconUrl: 'https://beefy.com/icons/128/BIFI.png',
    llamaSwapUrl:
      'https://swap.defillama.com/?chain=ethereum&from=0x0000000000000000000000000000000000000000&to=0xb1f1ee126e9c96231cc3d3fad7c08b4cf873b1f1',
  },
  {
    symbol: 'mooBIFI',
    address: '0xc55E93C62874D8100dBd2DfE307EDc1036ad5434',
    oracleId: 'opmooBIFI',
    chainId: 'optimism',
    icon: mooIcon,
    explorer: {
      name: 'Etherscan',
      icon: opIcon,
      url: 'https://optimistic.etherscan.io/token/0xc55E93C62874D8100dBd2DfE307EDc1036ad5434',
    },
    walletIconUrl: 'https://beefy.com/icons/128/mooBIFI.png',
    llamaSwapUrl:
      'https://swap.defillama.com/?chain=optimism&from=0x0000000000000000000000000000000000000000&to=0xc55E93C62874D8100dBd2DfE307EDc1036ad5434',
  },
  {
    symbol: 'mooBIFI',
    address: '0xc55E93C62874D8100dBd2DfE307EDc1036ad5434',
    oracleId: 'basemooBIFI',
    chainId: 'base',
    icon: mooIcon,
    explorer: {
      name: 'Etherscan',
      icon: baseIcon,
      url: 'https://basescan.org/token/0xc55E93C62874D8100dBd2DfE307EDc1036ad5434',
    },
    walletIconUrl: 'https://beefy.com/icons/128/mooBIFI.png',
    llamaSwapUrl:
      'https://swap.defillama.com/?chain=base&from=0x0000000000000000000000000000000000000000&to=0xc55E93C62874D8100dBd2DfE307EDc1036ad5434',
  },
];

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
