import type { ChainEntity } from '../../../../features/data/entities/chain';
import bifiIcon from '@repo/images/single-assets/BIFI.png';
import ethIcon from '@repo/images/networks/ethereum.svg';
import mooIcon from '@repo/images/single-assets/mooBIFI.png';
import opIcon from '@repo/images/networks/optimism.svg';
import baseIcon from '@repo/images/networks/base.svg';

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
