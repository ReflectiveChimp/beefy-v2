import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import type { ChainId } from '../../../../entities/chain';
import { ZERO_ADDRESS } from '../../../../../../helpers/addresses';
import { hashDomain, normalizeAddress, normalizeAndHashDomain, normalizeDomain } from '../../utils';
import type { Address } from 'viem';
import type { AllChainsFromTldToChain } from '../../types';
import type { tldToChain } from './tlds';

const registryAddresses: Record<AllChainsFromTldToChain<typeof tldToChain>, Address> = {
  // ethereum: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  bsc: '0x08CEd32a7f3eeC915Ba84415e9C07a7286977956',
  gnosis: '0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17',
  // manta: '0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17',
  mode: '0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17',
  arbitrum: '0x4a067EE58e73ac5E4a43722E008DFdf65B2bF348',
};

const registryAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'resolver',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] satisfies AbiItem[];

const resolverAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'addr',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] satisfies AbiItem[];

const reverseResolverAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] satisfies AbiItem[];

async function fetchResolverAddress(
  hash: string,
  chainId: ChainId,
  web3: Web3
): Promise<Address | undefined> {
  const registryAddress = registryAddresses[chainId];
  if (!registryAddress) {
    return undefined;
  }

  const contract = new web3.eth.Contract(registryAbi, registryAddress);
  try {
    const resolved = await contract.methods.resolver(hash).call();
    return normalizeAddress(resolved);
  } catch {
    return undefined;
  }
}

/**
 * Lookup the (first) address for a domain name
 */
export async function domainToAddress(
  domain: string,
  chainId: ChainId,
  web3: Web3
): Promise<Address | undefined> {
  const hash = normalizeAndHashDomain(domain);
  if (!hash) {
    return undefined;
  }

  const resolverAddress = await fetchResolverAddress(hash, chainId, web3);
  if (!resolverAddress || resolverAddress === ZERO_ADDRESS) {
    return undefined;
  }

  const resolverContract = new web3.eth.Contract(resolverAbi, resolverAddress);
  try {
    const resolved = await resolverContract.methods.addr(hash).call();
    return normalizeAddress(resolved);
  } catch {
    return undefined;
  }
}

/**
 * Lookup the (first) domain name for an address
 */
export async function addressToDomain(
  address: Address,
  chainId: ChainId,
  web3: Web3
): Promise<string | undefined> {
  const reverseDomain = `${normalizeDomain(address.slice(2))}.addr.reverse`;
  const reverseHash = hashDomain(reverseDomain);
  if (!reverseHash) {
    return undefined;
  }

  const resolverAddress = await fetchResolverAddress(reverseHash, chainId, web3);
  if (!resolverAddress || resolverAddress === ZERO_ADDRESS) {
    return undefined;
  }

  const resolverContract = new web3.eth.Contract(reverseResolverAbi, resolverAddress);
  try {
    const domain = await resolverContract.methods.name(reverseHash).call();
    return domain || undefined;
  } catch {
    return undefined;
  }
}
