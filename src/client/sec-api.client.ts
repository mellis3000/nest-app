import { Injectable } from '@nestjs/common';
import { mappingApi, queryApi, setApiKey } from 'sec-api';
import { SECCompany } from '../model/sec-company.model.js';
import { SECFilingsResponse } from '../model/sec-filing.model.js';

@Injectable()
export class SecApiClient {
  constructor() {
    const apiKey = process.env.SEC_API_KEY;
    if (!apiKey) {
      throw new Error('SEC_API_KEY environment variable is not set');
    }
    setApiKey(apiKey);
  }

  async resolveTicker(ticker: string): Promise<SECCompany[]> {
    return (await mappingApi.resolve('ticker', ticker)) as SECCompany[];
  }

  async queryFilings(query: string, from: number, size: number): Promise<SECFilingsResponse> {
    return (await queryApi.getFilings({
      query,
      from: String(from),
      size: String(size),
      sort: [{ filedAt: { order: 'desc' } }],
    })) as SECFilingsResponse;
  }
}
