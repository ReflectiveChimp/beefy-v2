import type {
  IOneInchApi,
  QuoteRequest,
  QuoteResponse,
  SwapRequest,
  SwapResponse,
} from './one-inch-types';
import type { ChainEntity } from '../../entities/chain';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { axiosErrorToString } from '../transact/helpers/axios';
import type { ChainConfig } from '../config-types';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.beefy.finance';

export const supportedChainIds: ChainConfig['id'][] = [
  'ethereum',
  'bsc',
  'polygon',
  'optimism',
  'arbitrum',
  'avax',
  'fantom',
  'aurora',
  'zksync',
  'base',
];

export class OneInchApi implements IOneInchApi {
  protected api: AxiosInstance;

  constructor(protected chain: ChainEntity) {
    if (!supportedChainIds.includes(chain.id)) {
      throw new Error(`OneInch api is not supported on ${chain.id}`);
    }

    this.api = axios.create({
      baseURL: `${API_URL}/oneinch/${chain.id}/`,
    });
  }

  protected async get<
    ResponseType extends object,
    RequestType extends Record<string, string | number | boolean>
  >(url: string, request: RequestType): Promise<ResponseType> {
    try {
      const response = await this.api.get<ResponseType>(url, {
        headers: {
          Accept: 'application/json',
        },
        params: request,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(axiosErrorToString(error));
      } else {
        throw error;
      }
    }
  }

  async getQuote(request: QuoteRequest): Promise<QuoteResponse> {
    return await this.get<QuoteResponse, QuoteRequest>('/quote', request);
  }

  async getSwap(request: SwapRequest): Promise<SwapResponse> {
    return await this.get<SwapResponse, SwapRequest>('/swap', request);
  }
}
