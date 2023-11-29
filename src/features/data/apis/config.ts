import { config as chainConfigs } from '../../../config/config';
import { Insurace, Nexus, QiDao } from '../../../helpers/partners';
import type { ChainEntity } from '../entities/chain';
import type {
  AmmConfig,
  BeefyBridgeConfig,
  BoostConfig,
  BridgeConfig,
  ChainConfig,
  FeaturedVaultConfig,
  MinterConfig,
  PartnersConfig,
  PlatformConfig,
  SwapAggregatorConfig,
  SwapAggregatorConfigLoose,
  VaultConfig,
  ZapConfig,
} from './config-types';
import { mapValues } from 'lodash-es';
import type { MigrationConfig } from '../reducers/wallet/migration';

/**
 * A class to access beefy configuration
 * Access to vaults, boosts, featured items, etc
 */
export class ConfigAPI {
  public async fetchChainConfigs(): Promise<ChainConfig[]> {
    return Object.entries(chainConfigs).map(([id, chain]) => ({ id, ...chain }));
  }

  public async fetchFeaturedVaults(): Promise<FeaturedVaultConfig> {
    return (await import('../../../config/vault/featured.json')).default;
  }

  public async fetchPartnersConfig(): Promise<PartnersConfig> {
    return { QiDao, Insurace, Nexus };
  }

  public async fetchZapAmms(): Promise<{ [chainId: ChainEntity['id']]: AmmConfig[] }> {
    return Object.fromEntries(
      await Promise.all(
        Object.keys(chainConfigs).map(async chainId => [
          chainId,
          (await import(`../../../config/zap/amm/${chainId}.json`)).default,
        ])
      )
    );
  }

  public async fetchBeefyBridgeConfig(): Promise<BeefyBridgeConfig> {
    return (await import('../../../config/beefy-bridge')).beefyBridgeConfig;
  }

  public async fetchZapSwapAggregators(): Promise<SwapAggregatorConfig[]> {
    const config: SwapAggregatorConfigLoose[] = (
      await import('../../../config/zap/swap-aggregators.json')
    ).default; // json types are wide
    return config as SwapAggregatorConfig[];
  }

  public async fetchZapConfigs(): Promise<ZapConfig[]> {
    return (await import('../../../config/zap/zaps.json')).default;
  }

  public async fetchAllVaults(): Promise<{ [chainId: ChainEntity['id']]: VaultConfig[] }> {
    return Object.fromEntries(
      await Promise.all(
        Object.keys(chainConfigs).map(async chainId => [
          chainId,
          (await import(`../../../config/vault/${chainId}.json`)).default,
        ])
      )
    );
  }

  public async fetchAllBoosts(): Promise<{ [chainId: ChainEntity['id']]: BoostConfig[] }> {
    const partnersById = (await import(`../../../config/boost/partners.json`)).default;
    const boosts = Object.fromEntries(
      await Promise.all(
        Object.keys(chainConfigs).map(async chainId => [
          chainId,
          (await import(`../../../config/boost/${chainId}.json`)).default,
        ])
      )
    );

    return mapValues(boosts, boosts =>
      boosts.map(boost => ({
        ...boost,
        partners: (boost.partners || []).map(partnerId => partnersById[partnerId]),
      }))
    );
  }

  public async fetchAllMinters(): Promise<{ [chainId: ChainEntity['id']]: MinterConfig[] }> {
    return Object.fromEntries(
      await Promise.all(
        Object.keys(chainConfigs).map(async chainId => [
          chainId,
          (await import(`../../../config/minters/${chainId}.tsx`)).minters,
        ])
      )
    );
  }

  public async fetchAllMigrators(): Promise<{
    [chainId: ChainEntity['id']]: MigrationConfig[];
  }> {
    return Object.fromEntries(
      await Promise.all(
        Object.keys(chainConfigs).map(async chainId => [
          chainId,
          (await import(`../../../config/migrators/${chainId}.tsx`)).migrators,
        ])
      )
    );
  }

  public async fetchPlatforms(): Promise<PlatformConfig[]> {
    return (await import('../../../config/platforms.json')).default;
  }

  public async fetchBridges(): Promise<BridgeConfig[]> {
    return (await import('../../../config/bridges.json')).default;
  }
}
