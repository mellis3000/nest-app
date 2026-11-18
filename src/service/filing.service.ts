import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SecApiClient } from '../client/sec-api.client.js';
import { toFiling } from '../mapper/filing.mapper.js';
import { Company } from '../model/company.model.js';
import { Filing } from '../model/filing.model.js';
import { Page } from '../model/page.model.js';

export const MAX_LIMIT = 50;
// sec-api cannot page past its first 10,000 hits.
export const MAX_RESULT_WINDOW = 10_000;
// The form type is placed inside a quoted sec-api query, so quotes and backslashes must stay out.
const FORM_TYPE_PATTERN = /^[A-Za-z0-9 /-]{1,20}$/;

@Injectable()
export class FilingService {
  constructor(private readonly secApiClient: SecApiClient) {}

  async getFilings(
    company: Company,
    limit: number,
    offset: number,
    formType?: string,
  ): Promise<Page<Filing>> {
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      throw new BadRequestException(`limit must be between 1 and ${MAX_LIMIT}`);
    }
    if (!Number.isInteger(offset) || offset < 0 || offset + limit > MAX_RESULT_WINDOW) {
      throw new BadRequestException(
        `offset must be at least 0 and offset + limit at most ${MAX_RESULT_WINDOW}`,
      );
    }

    if (formType !== undefined && !FORM_TYPE_PATTERN.test(formType)) {
      throw new BadRequestException(`Invalid formType: ${formType}`);
    }

    const query =
      formType === undefined
        ? `cik:${company.cik}`
        : `cik:${company.cik} AND formType:"${formType}"`;
    const response = await this.secApiClient.queryFilings(query, offset, limit);
    return {
      items: response.filings.map(toFiling),
      limit,
      offset,
      total: response.total.value,
    };
  }

  async getFilingByAccessionNumber(accessionNumber: string): Promise<Filing> {
    const response = await this.secApiClient.queryFilings(
      `accessionNo:"${accessionNumber}"`,
      0,
      1,
    );
    const [secFiling] = response.filings;
    if (!secFiling) {
      throw new NotFoundException(`No filing found for accession number: ${accessionNumber}`);
    }
    return toFiling(secFiling);
  }
}
