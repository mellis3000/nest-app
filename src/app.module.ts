import { Module } from '@nestjs/common';
import { SecApiClient } from './client/sec-api.client.js';
import { FilingController } from './controller/filing.controller.js';
import { CompanyService } from './service/company.service.js';
import { FilingService } from './service/filing.service.js';

@Module({
  imports: [],
  controllers: [FilingController],
  providers: [SecApiClient, CompanyService, FilingService],
})
export class AppModule {}
