import { secFiling } from '../../test/fixtures/sec.js';
import { toFiling } from './filing.mapper.js';

describe('toFiling', () => {
  it('maps the SEC filing fields onto our field names', () => {
    expect(toFiling(secFiling)).toStrictEqual({
      formType: '10-Q',
      filingDate: '2026-11-18T11:42:25-05:00',
      reportDate: '2026-09-30',
      accessionNumber: '0000000000-26-000001',
      primaryDocumentLink: 'https://example.com/primary.htm',
    });
  });
});
