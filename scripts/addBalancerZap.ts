import { ArgumentConfig, parse } from 'ts-command-line-args';
import {
  addressBookToAppId,
  AppChainId,
  appToAddressBookId,
  ChainConfig,
  chainRpcs,
  getAmmsForChain,
  getChain,
  getVaultsForChain,
} from './common/config';
import type { AmmConfigBalancer, VaultConfig } from '../src/features/data/apis/config-types';
import { isNonEmptyArray, NonEmptyArray } from './common/utils';
import { OptionalRecord } from '../src/features/data/utils/types-utils';
import { Address, createPublicClient, getAddress, Hex, http, parseAbi } from 'viem';
import PQueue from 'p-queue';
import path, { dirname } from 'node:path';
import {
  fileReadable,
  loadJson,
  loadJsonSupportingBigInt,
  saveJson,
  saveJsonSupportingBigInt,
} from './common/files';
import { mkdir } from 'node:fs/promises';
import { createCachedFactory, createFactory } from '../src/features/data/utils/factory-utils';
import { addressBook, Token } from 'blockchain-addressbook';
import { partition, sortBy } from 'lodash';
import platforms from '../src/config/platforms.json';
import { BalancerStrategyConfig } from '../src/features/data/apis/transact/strategies/strategy-configs';
import { sortVaultKeys } from './common/vault-fields';

const cacheBasePath = path.join(__dirname, '.cache', 'balancer');
const cacheApiPath = path.join(cacheBasePath, 'api');
const cacheRpcPath = path.join(cacheBasePath, 'rpc');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;
const ZERO_BYTES32 = `0x${'0'.repeat(32 * 2)}` as const;

type RunArgs = {
  help?: boolean;
  chain: string;
  vault: string;
  update?: boolean;
  quiet?: boolean;
};

type BalancerChainId =
  | 'ARBITRUM'
  | 'AVALANCHE'
  | 'BASE'
  | 'FANTOM'
  | 'FRAXTAL'
  | 'GNOSIS'
  | 'MAINNET'
  | 'MODE'
  | 'OPTIMISM'
  | 'POLYGON'
  | 'ZKEVM';

type BalancerPoolType = 'META_STABLE' | 'COMPOSABLE_STABLE' | 'WEIGHTED' | 'GYROE' | 'GYRO';

type BalancerPoolToken<TAddress = Address> = {
  index: number;
  address: TAddress;
  symbol: string;
  decimals: number;
  hasNestedPool: boolean;
};

type BalancerApiPool<TType = BalancerPoolType, TAddress = Address> = {
  id: Hex;
  address: TAddress;
  chain: BalancerChainId;
  name: string;
  symbol: string;
  decimals: number;
  type: TType;
  version: number;
  protocolVersion: number;
  poolTokens: Array<BalancerPoolToken<TAddress>>;
  factory: TAddress;
  owner: TAddress;
};

type RpcPool = {
  poolId: Hex;
  vaultAddress: Address;
  chainId: AppChainId;
  tokenRates?: readonly [bigint, bigint];
  normalizedWeights?: readonly bigint[];
  scalingFactors?: readonly bigint[];
};

type Pool = RpcPool & BalancerApiPool;

const chainIdToBalancerChainId: OptionalRecord<AppChainId, BalancerChainId> = {
  ethereum: 'MAINNET',
  polygon: 'POLYGON',
  optimism: 'OPTIMISM',
  fantom: 'FANTOM',
  arbitrum: 'ARBITRUM',
  avax: 'AVALANCHE',
  zkevm: 'ZKEVM',
  base: 'BASE',
  gnosis: 'GNOSIS',
  fraxtal: 'FRAXTAL',
  mode: 'MODE',
};

const supportedProtocolVersions = new Set<number>([2]);

const supportedPoolTypes: OptionalRecord<BalancerPoolType, { min: number; max: number }> = {
  COMPOSABLE_STABLE: { min: 3, max: 6 },
  WEIGHTED: { min: 1, max: 4 },
  GYROE: { min: 2, max: 2 },
  GYRO: { min: 2, max: 2 },
  META_STABLE: { min: 1, max: 1 },
};

const balancerPoolQuery = `
query Pool($id: String!, $chain: GqlChain){
  poolGetPool(id: $id, chain: $chain) {
    id
    address
    chain
    name
    symbol
    decimals
    type
    version
    protocolVersion
    factory
    owner
    poolTokens {
      index
      address
      symbol
      decimals
      hasNestedPool
    }
  }
}`;

const runArgsConfig: ArgumentConfig<RunArgs> = {
  help: {
    type: Boolean,
    alias: 'h',
    description: 'Display this usage guide.',
    optional: true,
  },
  chain: {
    type: String,
    alias: 'c',
    description: 'Which chain json file to process',
  },
  vault: {
    type: String,
    alias: 'v',
    description: 'Which vault id to process',
  },
  update: {
    type: Boolean,
    alias: 'u',
    description: 'Update the cache',
    optional: true,
  },
  quiet: {
    type: Boolean,
    alias: 'q',
    description: 'Only output warnings, errors and the zap json',
    optional: true,
  },
};

function isDefined<T>(value: T): value is Exclude<T, undefined | null> {
  return value !== undefined && value !== null;
}

function getRunArgs() {
  return parse<RunArgs>(runArgsConfig, {
    helpArg: 'help',
    headerContentSections: [
      {
        header: 'yarn addBalancerZap',
        content: 'Create zap config for a balancer vault.',
      },
    ],
  });
}

async function getVaults(chainId: string): Promise<NonEmptyArray<VaultConfig>> {
  const vaults = await getVaultsForChain(chainId);
  if (!isNonEmptyArray(vaults)) {
    throw new Error(`No vaults found for chain ${chainId}`);
  }
  return vaults;
}

async function getVault(chainId: string, vaultId: string) {
  const vaults = await getVaults(chainId);
  const vault = vaults.find(v => v.id === vaultId);
  if (!vault) {
    throw new Error(`Vault ${vaultId} not found for chain ${chainId}`);
  }
  if (!vault.tokenAddress) {
    throw new Error(`Vault ${vaultId} has no token address`);
  }

  return vault;
}

type ZapSwaps = {
  [chainId: string]: {
    [tokenAddress: string]: {
      [providerId: string]: boolean;
    };
  };
};

const getZapSwaps = createFactory(async () => {
  const response = await fetch(`https://api.beefy.finance/zap/swaps?_=${Date.now()}`);
  return (await response.json()) as ZapSwaps;
});

type TokenPrices = {
  [oracleId: string]: number;
};

const getTokenPrices = createFactory(async () => {
  const prices = await Promise.all(
    ['prices', 'lps'].map(async type => {
      const response = await fetch(`https://api.beefy.finance/${type}?_=${Date.now()}`);
      return (await response.json()) as TokenPrices;
    })
  );
  return Object.assign({}, ...prices) as TokenPrices;
});

function createViemClient(chainId: AppChainId, chain: ChainConfig) {
  return createPublicClient({
    batch: {
      multicall: {
        batchSize: 128,
        wait: 100,
      },
    },
    chain: {
      id: chain.chainId,
      name: chain.name,
      nativeCurrency: {
        decimals: 18,
        name: chain.walletSettings.nativeCurrency.name,
        symbol: chain.walletSettings.nativeCurrency.symbol,
      },
      rpcUrls: {
        public: { http: [chainRpcs[chainId]] },
        default: { http: [chainRpcs[chainId]] },
      },
      blockExplorers: {
        default: { name: `${chain.name} Explorer`, url: chain.explorerUrl },
      },
      contracts: {
        multicall3: {
          address: chain.multicall3Address,
        },
      },
    },
    transport: http(),
  });
}

const getViemClient = createCachedFactory(
  (chainId: AppChainId) => createViemClient(chainId, getChain(chainId)),
  (chainId: AppChainId) => chainId
);

function withFileCache<FN extends (...args: any[]) => any>(
  factoryFn: FN,
  cachePathFn: (...args: Parameters<FN>) => string
) {
  return async (
    forceUpdate: boolean,
    ...args: Parameters<FN>
  ): Promise<Awaited<ReturnType<FN>>> => {
    const cachePath = cachePathFn(...args);

    if (!forceUpdate) {
      try {
        if (await fileReadable(cachePath)) {
          return await loadJsonSupportingBigInt(cachePath);
        }
      } catch (e) {
        console.error('Failed to read cache', cachePath, e);
      }
    }

    const data = await factoryFn(...args);
    await mkdir(dirname(cachePath), { recursive: true });
    await saveJsonSupportingBigInt(cachePath, data, true);
    return data;
  };
}

function fulfilledOr<TResult, TDefault>(
  result: PromiseSettledResult<TResult>,
  defaultValue: TDefault
): TResult | TDefault {
  return result.status === 'fulfilled' ? result.value : defaultValue;
}

const fetchPoolRpcData = withFileCache(
  async (poolAddress: Address, chainId: AppChainId): Promise<RpcPool> => {
    const client = getViemClient(chainId);
    const [poolIdRes, vaultAddressRes, tokenRatesRes, normalizedWeightsRes, scalingFactorsRes] =
      await Promise.allSettled([
        client.readContract({
          address: poolAddress,
          abi: parseAbi(['function getPoolId() public view returns (bytes32)']),
          functionName: 'getPoolId',
        }),
        client.readContract({
          address: poolAddress,
          abi: parseAbi(['function getVault() public view returns (address)']),
          functionName: 'getVault',
        }),
        client.readContract({
          address: poolAddress,
          abi: parseAbi(['function getTokenRates() public view returns (uint256,uint256)']),
          functionName: 'getTokenRates',
        }),
        client.readContract({
          address: poolAddress,
          abi: parseAbi(['function getNormalizedWeights() public view returns (uint256[])']),
          functionName: 'getNormalizedWeights',
        }),
        client.readContract({
          address: poolAddress,
          abi: parseAbi(['function getScalingFactors() public view returns (uint256[])']),
          functionName: 'getScalingFactors',
        }),
      ]);

    const vaultAddress = fulfilledOr(vaultAddressRes, undefined);
    const poolId = fulfilledOr(poolIdRes, undefined);
    const tokenRates = fulfilledOr(tokenRatesRes, undefined);
    const normalizedWeights = fulfilledOr(normalizedWeightsRes, undefined);
    const scalingFactors = fulfilledOr(scalingFactorsRes, undefined);

    if (!vaultAddress || vaultAddress === ZERO_ADDRESS) {
      throw new Error(`No vault address found via vault.want().getVault()`);
    }
    if (!poolId || poolId === ZERO_BYTES32) {
      throw new Error(`No pool id found via vault.want().getPoolId()`);
    }

    return { poolId, vaultAddress, chainId, tokenRates, normalizedWeights, scalingFactors };
  },
  (poolAddress: Address, chainId: AppChainId) =>
    path.join(cacheRpcPath, chainId, `pool-${poolAddress}.json`)
);

const balancerApiQueue = new PQueue({
  concurrency: 1,
  interval: 1000,
  intervalCap: 1,
  autoStart: true,
  carryoverConcurrencyCount: true,
  throwOnTimeout: true,
});

balancerApiQueue.on('next', () => {
  console.log(
    `[BalancerApi] Pending: ${balancerApiQueue.pending + 1} Size: ${balancerApiQueue.size}`
  );
});

class BalancerApiPoolValidateError extends Error {
  constructor(public readonly pool: BalancerApiPool<string, string>, message: string) {
    super(message);
    this.name = 'BalancerApiPoolValidateError';
  }

  toString() {
    return `${this.name}: ${this.message}\n${JSON.stringify(this.pool, null, 2)}`;
  }
}

function validateBalancerApiPool(pool: BalancerApiPool<string, string>): BalancerApiPool {
  if (!supportedProtocolVersions.has(pool.protocolVersion)) {
    throw new BalancerApiPoolValidateError(
      pool,
      `Unsupported protocol version ${pool.protocolVersion}`
    );
  }

  const poolTypeSupport = supportedPoolTypes[pool.type];
  if (!poolTypeSupport) {
    throw new BalancerApiPoolValidateError(pool, `Unsupported pool type ${pool.type}`);
  }

  if (pool.version < poolTypeSupport.min || pool.version > poolTypeSupport.max) {
    throw new BalancerApiPoolValidateError(
      pool,
      `Unsupported pool type version ${pool.type} version ${pool.version} [supported: ${poolTypeSupport.min} -> ${poolTypeSupport.max}]`
    );
  }

  return {
    ...pool,
    address: getAddress(pool.address),
    owner: getAddress(pool.owner),
    factory: getAddress(pool.factory),
    type: pool.type as BalancerPoolType,
    poolTokens: sortBy(
      pool.poolTokens.map(t => ({
        ...t,
        address: getAddress(t.address),
      })),
      p => p.index
    ),
  };
}

const fetchPoolApiData = withFileCache(
  async (
    poolId: Hex,
    balancerChainId: BalancerChainId
  ): Promise<BalancerApiPool<string, string>> => {
    const response = await balancerApiQueue.add(() =>
      fetch('https://api-v3.balancer.fi/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: balancerPoolQuery,
          variables: { id: poolId, chain: balancerChainId },
        }),
      })
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pool data from balancer api: ${response.status} ${response.statusText}`
      );
    }

    const result = (await response.json()) as {
      data?: { poolGetPool?: BalancerApiPool<string, string> };
    };
    if (result?.data?.poolGetPool?.id !== poolId) {
      throw new Error('No pool result from balancer api');
    }

    return result.data.poolGetPool;
  },
  (poolId: Hex, balancerChainId: BalancerChainId) =>
    path.join(cacheApiPath, balancerChainId, `${poolId}.json`)
);

const getPoolApiData = createCachedFactory(
  async (forceUpdate: boolean, poolId: Hex, balancerChainId: BalancerChainId) =>
    validateBalancerApiPool(await fetchPoolApiData(forceUpdate, poolId, balancerChainId)),
  (_, poolId: Hex, balancerChainId: BalancerChainId) => `${balancerChainId}:${poolId}`
);

const getPoolRpcData = createCachedFactory(
  fetchPoolRpcData,
  (_, poolAddress: Address, chainId: AppChainId) => `${chainId}:${poolAddress}`
);

function checkPoolTokensAgainstAddressBook(pool: Pool, allRequired: boolean): boolean {
  const { tokenAddressMap } = addressBook[appToAddressBookId(pool.chainId)];
  // Tokens in the pool that are not the pool token
  const tokens = pool.poolTokens
    .filter(t => t.address !== pool.address && !t.hasNestedPool)
    .map(t => {
      const abToken = tokenAddressMap[t.address];
      if (abToken) {
        return {
          poolToken: t,
          inAddressBook: true as const,
          abToken,
        };
      }

      return {
        poolToken: t,
        inAddressBook: false as const,
      };
    });

  // Tokens in address book
  const [zapTokens, missingTokens] = partition(
    tokens,
    (
      t
    ): t is Extract<
      typeof t,
      {
        inAddressBook: true;
      }
    > => t.inAddressBook
  );
  if (!zapTokens.length) {
    throw new Error(
      `No tokens [${missingTokens.join(', ')}] found in ${pool.chainId} address book.`
    );
  }

  const tokenErrors = zapTokens
    .map(({ poolToken, abToken }) => {
      if (abToken.decimals !== poolToken.decimals) {
        return `Address book token decimals mismatch ${poolToken.symbol} (${poolToken.address}) ${poolToken.decimals} vs ${abToken.decimals}`;
      }
      return undefined;
    })
    .filter(isDefined);
  if (tokenErrors.length) {
    throw new Error(`${pool.type}: Token errors:\n${tokenErrors.join('\n')}`);
  }

  if (zapTokens.length !== tokens.length) {
    const message = `${pool.type}: Some tokens not found in address book:\n${missingTokens
      .map(({ poolToken }) => `  ${poolToken.symbol} (${poolToken.address})`)
      .join('\n')}`;

    if (allRequired) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }

  return true;
}

type PoolToken = BalancerPoolToken<Address> & {
  abToken?: Token;
  price?: number;
  swapProviders: string[];
  isBPT: boolean;
};

function getPoolTokens(pool: Pool, prices: TokenPrices, swaps: ZapSwaps) {
  const { tokenAddressMap } = addressBook[appToAddressBookId(pool.chainId)];
  const tokens: PoolToken[] = [];
  const tokensWithBpt: PoolToken[] = [];

  for (const poolToken of pool.poolTokens) {
    const isBPT = poolToken.address === pool.address;
    const abToken = tokenAddressMap[poolToken.address];
    if (abToken && abToken.decimals !== poolToken.decimals) {
      throw new Error(
        `Address book token decimals mismatch ${poolToken.symbol} (${poolToken.address}) ${poolToken.decimals} vs ${abToken.decimals}`
      );
    }
    const price = abToken ? prices[abToken.oracleId] : undefined;
    const swapProviders = Object.entries(swaps[pool.chainId]?.[poolToken.address] || {})
      .filter(([, v]) => v)
      .map(([k]) => k);
    const token = {
      ...poolToken,
      isBPT,
      abToken,
      price,
      swapProviders,
    };

    if (!isBPT) {
      tokens.push(token);
    }
    tokensWithBpt.push(token);
  }

  return { tokens, tokensWithBpt };
}

function logTokens(tokens: PoolToken[]) {
  console.table(
    tokens.map(t => ({
      symbol: t.symbol,
      address: t.address,
      addressBook: !!t.abToken,
      price: t.price,
      swapProviders: t.swapProviders.length ? t.swapProviders : false,
    }))
  );
}

function checkWeightedPool(pool: Pool, tokens: PoolToken[], tokensWithBpt: PoolToken[]): boolean {
  if (tokensWithBpt.length !== tokens.length) {
    throw new Error(`${pool.type}: Did not expect BPT token in pool`);
  }

  if (tokens.every(t => !t.abToken || !t.price)) {
    logTokens(tokens);
    throw new Error(
      `${pool.type}: At least one token must be in the address book and have a price`
    );
  }

  if (tokens.every(t => !t.abToken || !t.price || !t.swapProviders.length)) {
    console.warn(
      `${pool.type}: No tokens are in the address book, have a price, and have a zap swap provider - only pool tokens will be available for deposit`
    );
  }

  if (!pool.normalizedWeights) {
    throw new Error(`${pool.type}: Tokens must have normalized weights`);
  }

  if (pool.normalizedWeights.length !== pool.poolTokens.length) {
    throw new Error(
      `${pool.type}: Normalized weights length ${pool.normalizedWeights.length} does not match tokens length ${pool.poolTokens.length}`
    );
  }

  return true;
}

function checkGyroPool(pool: Pool, tokens: PoolToken[], tokensWithBpt: PoolToken[]): boolean {
  if (tokensWithBpt.length !== tokens.length) {
    throw new Error(`${pool.type}: Did not expect BPT token in pool`);
  }

  // Gyro always needs to join with all tokens
  if (tokens.some(t => !t.abToken || !t.price || !t.swapProviders.length)) {
    logTokens(tokens);
    throw new Error(
      `${pool.type}: All tokens must be in the address book, have a price, and have a zap swap provider`
    );
  }

  if (pool.poolTokens.length !== 2) {
    throw new Error(`${pool.type}: Must have 2 tokens [${pool.poolTokens.length} found]`);
  }

  if (!pool.tokenRates) {
    throw new Error(`${pool.type}: Must have token rates`);
  }

  if (pool.tokenRates.length !== pool.poolTokens.length) {
    throw new Error(
      `${pool.type}: Token rates length ${pool.tokenRates.length} does not match tokens length ${pool.poolTokens.length}`
    );
  }

  return true;
}

function checkMetaStablePool(pool: Pool, tokens: PoolToken[], tokensWithBpt: PoolToken[]): boolean {
  if (tokensWithBpt.length !== tokens.length) {
    throw new Error(`${pool.type}: Did not expect BPT token in pool`);
  }

  if (tokens.every(t => !t.abToken || !t.price)) {
    logTokens(tokens);
    throw new Error(
      `${pool.type}: At least one token must be in the address book and have a price`
    );
  }

  if (tokens.every(t => !t.abToken || !t.price || !t.swapProviders.length)) {
    console.warn(
      `${pool.type}: No tokens are in the address book, have a price, and have a zap swap provider - only pool tokens will be available for deposit`
    );
  }

  if (!pool.scalingFactors) {
    throw new Error(`${pool.type}: Pool must have scaling factors`);
  }

  if (pool.scalingFactors.length !== pool.poolTokens.length) {
    throw new Error(
      `${pool.type}: Scaling factors length ${pool.scalingFactors.length} does not match tokens length ${pool.poolTokens.length}`
    );
  }

  return true;
}

function checkComposableStablePool(
  pool: Pool,
  tokens: PoolToken[],
  tokensWithBpt: PoolToken[]
): boolean {
  if (tokens.length !== tokensWithBpt.length - 1) {
    throw new Error(
      `${pool.type}: Expected 1 BPT token [${tokensWithBpt.length - tokens.length} found]`
    );
  }

  if (tokens.every(t => !t.abToken || !t.price)) {
    logTokens(tokens);
    throw new Error(
      `${pool.type}: At least one token must be in the address book and have a price`
    );
  }

  if (tokens.every(t => !t.abToken || !t.price || !t.swapProviders.length)) {
    console.warn(
      `${pool.type}: No tokens are in the address book, have a price, and have a zap swap provider - only pool tokens will be available for deposit`
    );
  }

  return true;
}

const poolTypeToChecker: Record<
  BalancerPoolType,
  (pool: Pool, tokens: PoolToken[], tokensWithBpt: PoolToken[]) => boolean
> = {
  GYRO: checkGyroPool,
  GYROE: checkGyroPool,
  WEIGHTED: checkWeightedPool,
  COMPOSABLE_STABLE: checkComposableStablePool,
  META_STABLE: checkMetaStablePool,
};

async function findAmmForPool(pool: Pool, tokenProviderId: string): Promise<AmmConfigBalancer> {
  const platform = platforms.find(p => p.id === tokenProviderId);
  if (!platform) {
    throw new Error(`No platform found for token provider id ${tokenProviderId}`);
  }

  const amms = await getAmmsForChain(pool.chainId);
  if (!amms.length) {
    throw new Error(`No AMMs found for chain ${pool.chainId}`);
  }

  const amm = amms.find(
    (a): a is AmmConfigBalancer => a.type === 'balancer' && a.vaultAddress === pool.vaultAddress
  );
  if (!amm) {
    console.log(
      JSON.stringify({
        id: `${pool.chainId}-${tokenProviderId}`,
        type: 'balancer',
        name: platform.name,
        vaultAddress: pool.vaultAddress,
      })
    );
    throw new Error(
      `No balancer AMM with vaultAddress ${pool.vaultAddress} found on chain ${pool.chainId}`
    );
  }

  return amm;
}

export async function discoverBalancerZap(args: RunArgs) {
  const chainId = addressBookToAppId(args.chain);
  const chain = getChain(chainId);
  const vault = await getVault(chainId, args.vault);
  if (!vault.tokenAddress) {
    throw new Error(`No vault address found for vault ${vault.id}`);
  }
  if (!vault.tokenProviderId) {
    throw new Error(`No token provider id found for vault ${vault.id}`);
  }
  const poolAddress = getAddress(vault.tokenAddress);

  if (!args.quiet) {
    console.log('=== Vault ===');
    console.log('Id:', vault.id);
    console.log('Chain:', chain.name);
    console.log('Assets:', vault.assets?.length ? vault.assets.join(', ') : 'not set');
    console.log('Want:', poolAddress);
  }
  const balancerChainId = chainIdToBalancerChainId[chainId];
  if (!balancerChainId) {
    throw new Error(`No balancer chain id found for chain ${chainId}`);
  }

  const rpcPool = await getPoolRpcData(!!args.update, poolAddress, chainId);
  if (!args.quiet) {
    console.log('=== Pool ===');
    console.log('Id:', rpcPool.poolId);
    console.log('Vault:', rpcPool.vaultAddress);
  }

  const apiPool = await getPoolApiData(!!args.update, rpcPool.poolId, balancerChainId);
  const pool: Pool = {
    ...rpcPool,
    ...apiPool,
  };

  if (!args.quiet) {
    console.log('Name:', apiPool.name);
    console.log('Symbol:', apiPool.symbol);
    console.log('Type:', `${apiPool.type} v${apiPool.version}`);
    console.log('Tokens:');
    console.log(
      apiPool.poolTokens
        .map(
          t =>
            `  ${t.index} ${t.symbol} (${t.address})${
              t.address === apiPool.address ? ' [self]' : ''
            }`
        )
        .join('\n')
    );
  }

  const [swaps, prices] = await Promise.all([getZapSwaps(), getTokenPrices()]);
  const { tokens, tokensWithBpt } = getPoolTokens(pool, prices, swaps);
  const checker = poolTypeToChecker[pool.type];
  if (!checker) {
    throw new Error(`No checker found for pool type ${pool.type}`);
  }
  if (!checker(pool, tokens, tokensWithBpt)) {
    throw new Error(`Checker failed for pool type ${pool.type}`);
  }

  const amm = await findAmmForPool(pool, vault.tokenProviderId);
  if (!args.quiet) {
    console.log('=== AMM ===');
    console.log('Id:', amm.id);
    console.log('Name:', amm.name);
    console.log('Vault:', amm.vaultAddress);
  }

  const type = pool.type;
  switch (type) {
    case 'COMPOSABLE_STABLE': {
      return {
        strategyId: 'balancer',
        ammId: amm.id,
        poolId: apiPool.id,
        poolType: transformPoolType(type),
        tokens: tokens.map(t => t.address),
        bptIndex: tokensWithBpt.findIndex(t => t.isBPT),
        hasNestedPool: tokens.some(t => t.hasNestedPool),
      } satisfies BalancerStrategyConfig;
    }
    case 'GYRO':
    case 'GYROE':
    case 'META_STABLE':
    case 'WEIGHTED': {
      return {
        strategyId: 'balancer',
        ammId: amm.id,
        poolId: apiPool.id,
        poolType: transformPoolType(type),
        tokens: apiPool.poolTokens.map(t => t.address),
      } satisfies BalancerStrategyConfig;
    }
    default: {
      throw new Error(`Unsupported pool type ${pool.type}`);
    }
  }
}

type TransformPoolType<T extends string> = T extends `${infer Head}_${infer Tail}`
  ? `${Lowercase<Head>}-${TransformPoolType<Tail>}`
  : Lowercase<T>;

function transformPoolType<T extends string>(input: T): TransformPoolType<T> {
  return input.toLowerCase().replaceAll('_', '-') as TransformPoolType<T>;
}

async function saveZap(chainId: string, vaultId: string, zap: BalancerStrategyConfig) {
  const path = `./src/config/vault/${addressBookToAppId(chainId)}.json`;
  const vaults = await loadJson<VaultConfig[]>(path);
  let found = false;
  const modified = vaults.map(vault => {
    if (vault.id === vaultId) {
      found = true;
      return sortVaultKeys({
        ...vault,
        zaps: [zap],
      });
    }
    return vault;
  });
  if (!found) {
    throw new Error(`Vault ${vaultId} not found`);
  }

  await saveJson(path, modified, 'prettier');
}

async function start() {
  const args = getRunArgs();
  if (args.help) {
    return;
  }

  const zap = await discoverBalancerZap(args);
  if (!args.quiet) {
    console.log('Zap:', JSON.stringify(zap, null, 2));
  }

  await saveZap(args.chain, args.vault, zap);
}

if (require.main === module) {
  start().catch(e => {
    console.error(e);
    process.exit(1);
  });
}