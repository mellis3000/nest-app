import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SecApiClient } from '../client/sec-api.client.js';
import { toCompany } from '../mapper/company.mapper.js';
import { Company } from '../model/company.model.js';

// The ticker goes into the sec-api request URL unescaped, so only plain ticker characters are allowed.
const TICKER_PATTERN = /^[A-Za-z0-9.-]{1,10}$/;

@Injectable()
export class CompanyService {
  constructor(private readonly secApiClient: SecApiClient) {}

  async getCompany(ticker: string): Promise<Company> {
    if (!TICKER_PATTERN.test(ticker)) {
      throw new BadRequestException(`Invalid ticker: ${ticker}`);
    }

    const [secCompany] = await this.secApiClient.resolveTicker(ticker);
    if (!secCompany) {
      throw new NotFoundException(`No company found for ticker: ${ticker}`);
    }

    return toCompany(secCompany);
  }
}
