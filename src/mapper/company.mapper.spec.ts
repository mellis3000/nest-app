import { secCompany } from '../../test/fixtures/sec.js';
import { toCompany } from './company.mapper.js';

describe('toCompany', () => {
  it('copies cik, name, ticker, sector and industry and drops the rest', () => {
    expect(toCompany(secCompany)).toStrictEqual({
      cik: '1000001',
      name: 'EXAMPLE CORP',
      ticker: 'EXMP',
      sector: 'Technology',
      industry: 'Software',
    });
  });
});
