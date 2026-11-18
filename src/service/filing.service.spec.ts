import { BadRequestException, NotFoundException } from '@nestjs/common';
import { secFiling } from '../../test/fixtures/sec.js';
import { SecApiClient } from '../client/sec-api.client.js';
import { Company } from '../model/company.model.js';
import { FilingService } from './filing.service.js';

const company: Company = {
  cik: '1000001',
  name: 'EXAMPLE CORP',
  ticker: 'EXMP',
  sector: 'Technology',
  industry: 'Software',
};

const filing = {
  formType: '10-Q',
  filingDate: '2026-11-18T11:42:25-05:00',
  reportDate: '2026-09-30',
  accessionNumber: '0000000000-26-000001',
  primaryDocumentLink: 'https://example.com/primary.htm',
};

describe('FilingService', () => {
  let queryFilings: ReturnType<typeof vi.fn>;
  let service: FilingService;

  beforeEach(() => {
    queryFilings = vi.fn().mockResolvedValue({
      total: { value: 120, relation: 'eq' },
      filings: [secFiling],
    });
    service = new FilingService({ queryFilings } as unknown as SecApiClient);
  });

  describe('getFilings', () => {
    it("returns the requested page of the company's filings", async () => {
      const page = await service.getFilings(company, 10, 20);

      expect(queryFilings).toHaveBeenCalledWith('cik:1000001', 20, 10);
      expect(page).toStrictEqual({ items: [filing], limit: 10, offset: 20, total: 120 });
    });

    it.each([
      [1, 0],
      [50, 0],
      [50, 9950],
    ])('accepts limit %i with offset %i', async (limit, offset) => {
      await service.getFilings(company, limit, offset);

      expect(queryFilings).toHaveBeenCalledWith('cik:1000001', offset, limit);
    });

    it.each([
      [0, 0],
      [51, 0],
      [1.5, 0],
      [10, -1],
      [10, 2.5],
      [50, 9951],
    ])('rejects limit %d with offset %d', async (limit, offset) => {
      await expect(service.getFilings(company, limit, offset)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(queryFilings).not.toHaveBeenCalled();
    });
  });

  describe('getFilings with formType', () => {
    it.each(['10-K', '10-K/A', 'DEF 14A', 'SC 13G/A'])(
      'narrows the query to form type %j',
      async (formType) => {
        await service.getFilings(company, 50, 0, formType);

        expect(queryFilings).toHaveBeenCalledWith(
          `cik:1000001 AND formType:"${formType}"`,
          0,
          50,
        );
      },
    );

    it.each(['', '10-K" OR cik:1', '10-K\\', 'A'.repeat(21)])(
      'rejects form type %j without querying',
      async (formType) => {
        await expect(service.getFilings(company, 50, 0, formType)).rejects.toBeInstanceOf(
          BadRequestException,
        );
        expect(queryFilings).not.toHaveBeenCalled();
      },
    );
  });

  describe('getFilingByAccessionNumber', () => {
    it('queries by quoted accessionNo and returns the match', async () => {
      const result = await service.getFilingByAccessionNumber('0000000000-26-000001');

      expect(queryFilings).toHaveBeenCalledWith('accessionNo:"0000000000-26-000001"', 0, 1);
      expect(result).toStrictEqual(filing);
    });

    it('throws NotFound when nothing matches', async () => {
      queryFilings.mockResolvedValue({ total: { value: 0, relation: 'eq' }, filings: [] });

      await expect(
        service.getFilingByAccessionNumber('0000000000-26-999999'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
