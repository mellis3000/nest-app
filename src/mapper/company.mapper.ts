import { Company } from '../model/company.model.js';
import { SECCompany } from '../model/sec-company.model.js';

export function toCompany(secCompany: SECCompany): Company {
  return {
    cik: secCompany.cik,
    name: secCompany.name,
    ticker: secCompany.ticker,
    sector: secCompany.sector,
    industry: secCompany.industry,
  };
}
