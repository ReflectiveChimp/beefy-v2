import { type Address } from 'viem';
import { getAllChainsFromTldToChain, normalizeAddress } from './utils';
import type { ChainEntity, ChainId } from '../../entities/chain';
import type { Resolver } from './types';
import { getWeb3Instance } from '../instances';
import { resolvers } from './resolvers';
import { isFulfilledResult } from '../../../../helpers/promises';
import { isDefined } from '../../utils/array-utils';

export class NameServicesApi {
  constructor(protected chainIdToEntity: Record<ChainId, ChainEntity>) {}

  /** Get the domain for an address */
  public async resolveAddressToDomain(address: string): Promise<string | undefined> {
    if (!address || !address.length) {
      return undefined;
    }

    const checksumAddress = normalizeAddress(address);
    if (!checksumAddress) {
      return undefined;
    }

    const lookups: { resolver: Resolver; chainId: ChainId }[] = [];

    for (const resolver of resolvers) {
      const chainIds = getAllChainsFromTldToChain(await resolver.tldToChain());
      for (const chainId of chainIds) {
        lookups.push({ resolver, chainId });
      }
    }

    const results = await Promise.allSettled(
      lookups.map(async ({ resolver, chainId }) => {
        const { addressToDomain } = await resolver.methods();
        const web3 = await getWeb3Instance(this.chainIdToEntity[chainId]);
        return addressToDomain(checksumAddress, chainId, web3);
      })
    );

    const validResults = results
      .filter(isFulfilledResult)
      .map(r => r.value)
      .filter(isDefined);
    return validResults.length ? validResults[0] : undefined;
  }

  /** Get the address for a domain */
  public async resolveDomainToAddress(domain: string): Promise<Address | undefined> {
    if (!domain || !domain.length) {
      return undefined;
    }

    const tld = this.getDomainTld(domain);
    if (!tld) {
      return undefined;
    }

    const lookups: { resolver: Resolver; chainId: ChainId }[] = [];

    for (const resolver of resolvers) {
      const tldToChain = await resolver.tldToChain();
      const chainIds = tldToChain[tld];
      if (chainIds && chainIds.length) {
        for (const chainId of chainIds) {
          lookups.push({ resolver, chainId });
        }
      }
    }

    if (lookups.length === 0) {
      return undefined;
    }

    const results = await Promise.allSettled(
      lookups.map(async ({ resolver, chainId }) => {
        const { domainToAddress } = await resolver.methods();
        const web3 = await getWeb3Instance(this.chainIdToEntity[chainId]);
        return domainToAddress(domain, chainId, web3);
      })
    );

    const validResults = results
      .filter(isFulfilledResult)
      .map(r => r.value)
      .filter(isDefined);

    return validResults.length ? validResults[0] : undefined;
  }

  protected getDomainTld(domain: string): string | undefined {
    const lastDot = domain.lastIndexOf('.');
    if (lastDot === -1) {
      return domain;
    }

    const tld = domain.slice(lastDot + 1);
    return tld.length ? tld : undefined;
  }
}
