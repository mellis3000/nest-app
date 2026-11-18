export class SECFilingEntity {
  companyName: string;
  cik: string;
  irsNo: string;
  stateOfIncorporation?: string;
  fiscalYearEnd: string;
  type: string;
  act: string;
  fileNo: string;
  filmNo: string;
  sic: string;
  // The API's own key name; it holds the SEC office, e.g. "03 Life Sciences)".
  undefined: string;
}

export class SECFilingDocument {
  sequence: string;
  description?: string;
  documentUrl: string;
  type: string;
  size: string;
}

export class SECFiling {
  id: string;
  accessionNo: string;
  cik: string;
  ticker: string;
  companyName: string;
  companyNameLong: string;
  formType: string;
  description: string;
  filedAt: string;
  periodOfReport: string;
  effectivenessDate?: string;
  linkToTxt: string;
  linkToHtml: string;
  linkToXbrl: string;
  linkToFilingDetails: string;
  entities: SECFilingEntity[];
  documentFormatFiles: SECFilingDocument[];
  dataFiles: SECFilingDocument[];
  // Always empty in the example data, so its element shape is unknown.
  seriesAndClassesContractsInformation: unknown[];
}

export class SECFilingsResponse {
  total: { value: number; relation: string };
  filings: SECFiling[];
}
