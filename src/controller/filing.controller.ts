import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Company } from '../model/company.model.js';
import { Filing } from '../model/filing.model.js';
import { Page } from '../model/page.model.js';
import { CompanyService } from '../service/company.service.js';
import { FilingService, MAX_LIMIT } from '../service/filing.service.js';

@Controller()
export class FilingController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly filingService: FilingService,
  ) {}

  @Get('/company/:ticker')
  async getCompany(@Param('ticker') ticker: string): Promise<Company> {
    // TODO authenticate and authorize user
    return this.companyService.getCompany(ticker);
  }

  @Get('/company/:ticker/filings')
  async getFilings(
    @Param('ticker') ticker: string,
    @Query('limit', new DefaultValuePipe(MAX_LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('formType') formType?: string,
  ): Promise<Page<Filing>> {
    // TODO authenticate and authorize user
    const company = await this.companyService.getCompany(ticker);
    return this.filingService.getFilings(company, limit, offset, formType);
  }

  @Get('/filing/:accessionNumber')
  async getFilingByAccessionNumber(@Param('accessionNumber') accessionNumber: string): Promise<Filing> {
    // TODO authenticate and authorize user
    return this.filingService.getFilingByAccessionNumber(accessionNumber);
  }
}
