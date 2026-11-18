import { SECCompany } from '../../src/model/sec-company.model.js';
import { SECFiling } from '../../src/model/sec-filing.model.js';

export const secCompany: SECCompany = {
  id: 'abc123',
  name: 'EXAMPLE CORP',
  ticker: 'EXMP',
  cik: '1000001',
  cusip: '000000000',
  exchange: 'NASDAQ',
  isDelisted: false,
  category: 'Domestic Common Stock',
  sector: 'Technology',
  industry: 'Software',
  sic: '7372',
  sicSector: 'Services',
  sicIndustry: 'Prepackaged Software',
  famaSector: '',
  famaIndustry: 'Business Services',
  currency: 'USD',
  location: 'Nowhere; U.S.A',
};

export const secFiling: SECFiling = {
  id: 'def456',
  accessionNo: '0000000000-26-000001',
  cik: '1000001',
  ticker: 'EXMP',
  companyName: 'EXAMPLE CORP',
  companyNameLong: 'EXAMPLE CORP (Filer)',
  formType: '10-Q',
  description: 'Form 10-Q - Quarterly report',
  filedAt: '2026-11-18T11:42:25-05:00',
  periodOfReport: '2026-09-30',
  effectivenessDate: '2026-11-17',
  linkToTxt: 'https://example.com/filing.txt',
  linkToHtml: 'https://example.com/filing-index.htm',
  linkToXbrl: '',
  linkToFilingDetails: 'https://example.com/primary.htm',
  entities: [],
  documentFormatFiles: [],
  dataFiles: [],
  seriesAndClassesContractsInformation: [],
};
