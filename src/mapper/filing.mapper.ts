import { Filing } from '../model/filing.model.js';
import { SECFiling } from '../model/sec-filing.model.js';

export function toFiling(secFiling: SECFiling): Filing {
  return {
    formType: secFiling.formType,
    filingDate: secFiling.filedAt,
    reportDate: secFiling.periodOfReport,
    accessionNumber: secFiling.accessionNo,
    primaryDocumentLink: secFiling.linkToFilingDetails,
  };
}
