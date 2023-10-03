import type { AmmEntity, AmmEntitySolidly, AmmEntityUniswapV2 } from '../../entities/amm';
import { isSolidlyAmm, isUniswapV2Amm } from '../../entities/amm';
import { UniswapV2Pool } from './uniswap-v2/UniswapV2Pool';
import type { ChainEntity } from '../../entities/chain';
import { SolidlyPool } from './solidly/SolidlyPool';
import { MdexUniswapV2Pool } from './uniswap-v2/MdexUniswapV2Pool';
import type { IPool } from './types';
import { BiSwapUniswapV2Pool } from './uniswap-v2/BiSwapUniswapV2Pool';
import { ConeSolidlyPool } from './solidly/ConeSolidlyPool';
import { SwapsicleUniswapV2Pool } from './uniswap-v2/SwapsicleUniswapV2Pool';
import { MMFUniswapV2Pool } from './uniswap-v2/MMFUniswapV2Pool';
import { TombSwapUniswapV2Pool } from './uniswap-v2/TombSwapUniswapV2Pool';
import { SpiritSwapV2SolidlyPool } from './solidly/SpiritSwapV2SolidlyPool';
import { NetswapUniswapV2Pool } from './uniswap-v2/NetswapUniswapV2Pool';
import { StellaUniswapV2Pool } from './uniswap-v2/StellaUniswapV2Pool';
import { VelodromeSolidlyPool } from './solidly/VelodromeSolidlyPool';
import { EthereumSolidlyPool } from './solidly/EthereumSolidlyPool';

const mapUniswapV2 = {
  'avax-swapsicle': SwapsicleUniswapV2Pool,
  'bsc-mdex': MdexUniswapV2Pool,
  'bsc-biswap': BiSwapUniswapV2Pool,
  'cronos-mmf': MMFUniswapV2Pool,
  'fantom-tombswap': TombSwapUniswapV2Pool,
  'metis-netswap': NetswapUniswapV2Pool,
  'moonbeam-stella': StellaUniswapV2Pool,
} as const satisfies Record<string, typeof UniswapV2Pool>;

const mapSolidly = {
  'bsc-cone': ConeSolidlyPool,
  'arbitrum-solidlizard': ConeSolidlyPool,
  'fantom-spirit-v2': SpiritSwapV2SolidlyPool,
  'optimism-velodrome': VelodromeSolidlyPool,
  'fantom-equalizer': VelodromeSolidlyPool,
  'canto-velocimeter': VelodromeSolidlyPool,
  'kava-equilibre': VelodromeSolidlyPool,
  'arbitrum-ramses': VelodromeSolidlyPool,
  'ethereum-solidly': EthereumSolidlyPool,
} as const satisfies Record<string, typeof SolidlyPool>;

export async function getPool(
  lpAddress: string,
  amm: AmmEntityUniswapV2,
  chain: ChainEntity
): Promise<UniswapV2Pool>;
export async function getPool(
  lpAddress: string,
  amm: AmmEntitySolidly,
  chain: ChainEntity
): Promise<SolidlyPool>;
export async function getPool(
  lpAddress: string,
  amm: AmmEntity,
  chain: ChainEntity
): Promise<IPool>;
export async function getPool(
  lpAddress: string,
  amm: AmmEntity,
  chain: ChainEntity
): Promise<IPool> {
  if (isUniswapV2Amm(amm)) {
    const Constructor: typeof UniswapV2Pool = mapUniswapV2[amm.id] || UniswapV2Pool;
    return await initPool(new Constructor(lpAddress, amm, chain));
  } else if (isSolidlyAmm(amm)) {
    const Constructor: typeof SolidlyPool = mapSolidly[amm.id] || SolidlyPool;
    return await initPool(new Constructor(lpAddress, amm, chain));
  } else {
    throw new Error(`Unknown AMM type`);
  }
}

async function initPool<T extends IPool>(pool: T): Promise<T> {
  await pool.updateAllData();
  return pool;
}
