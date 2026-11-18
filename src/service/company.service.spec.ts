import { BadRequestException, NotFoundException } from '@nestjs/common';
import { secCompany } from '../../test/fixtures/sec.js';
import { SecApiClient } from '../client/sec-api.client.js';
import { CompanyService } from './company.service.js';

describe('CompanyService', () => {
  let resolveTicker: ReturnType<typeof vi.fn>;
  let service: CompanyService;

  beforeEach(() => {
    resolveTicker = vi.fn();
    service = new CompanyService({ resolveTicker } as unknown as SecApiClient);
  });

  it('resolves the ticker and returns the first match as a Company', async () => {
    resolveTicker.mockResolvedValue([secCompany, Object.assign({}, secCompany, { name: 'OTHER' })]);

    const company = await service.getCompany('EXMP');

    expect(resolveTicker).toHaveBeenCalledWith('EXMP');
    expect(company).toStrictEqual({
      cik: '1000001',
      name: 'EXAMPLE CORP',
      ticker: 'EXMP',
      sector: 'Technology',
      industry: 'Software',
    });
  });

  it('throws NotFound when the ticker matches no company', async () => {
    resolveTicker.mockResolvedValue([]);

    await expect(service.getCompany('NONE')).rejects.toBeInstanceOf(NotFoundException);
  });

  it.each(['', 'EX/MP', 'EXMP?token=x', 'TOOLONGTICKER'])(
    'rejects ticker %j without calling the API',
    async (ticker) => {
      await expect(service.getCompany(ticker)).rejects.toBeInstanceOf(BadRequestException);
      expect(resolveTicker).not.toHaveBeenCalled();
    },
  );

  it.each(['BRK.B', 'BF-A', 'aapl'])('accepts ticker %j', async (ticker) => {
    resolveTicker.mockResolvedValue([secCompany]);

    await service.getCompany(ticker);

    expect(resolveTicker).toHaveBeenCalledWith(ticker);
  });
});
