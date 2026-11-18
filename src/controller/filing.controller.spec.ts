import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { secCompany, secFiling } from '../../test/fixtures/sec.js';
import { AppModule } from '../app.module.js';
import { SecApiClient } from '../client/sec-api.client.js';

const filing = {
  formType: '10-Q',
  filingDate: '2026-11-18T11:42:25-05:00',
  reportDate: '2026-09-30',
  accessionNumber: '0000000000-26-000001',
  primaryDocumentLink: 'https://example.com/primary.htm',
};

describe('FilingController', () => {
  let app: INestApplication;
  let resolveTicker: ReturnType<typeof vi.fn>;
  let queryFilings: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    resolveTicker = vi.fn().mockResolvedValue([secCompany]);
    queryFilings = vi.fn().mockResolvedValue({
      total: { value: 120, relation: 'eq' },
      filings: [secFiling],
    });
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(SecApiClient)
      .useValue({ resolveTicker, queryFilings })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /company/:ticker returns the company', async () => {
    const response = await request(app.getHttpServer()).get('/company/EXMP').expect(200);

    expect(response.body).toStrictEqual({
      cik: '1000001',
      name: 'EXAMPLE CORP',
      ticker: 'EXMP',
      sector: 'Technology',
      industry: 'Software',
    });
  });

  it('GET /company/:ticker/filings defaults to the first 50 filings', async () => {
    const response = await request(app.getHttpServer()).get('/company/EXMP/filings').expect(200);

    expect(resolveTicker).toHaveBeenCalledWith('EXMP');
    expect(queryFilings).toHaveBeenCalledWith('cik:1000001', 0, 50);
    expect(response.body).toStrictEqual({ items: [filing], limit: 50, offset: 0, total: 120 });
  });

  it('GET /company/:ticker/filings passes limit and offset through', async () => {
    const response = await request(app.getHttpServer())
      .get('/company/EXMP/filings?limit=10&offset=20')
      .expect(200);

    expect(queryFilings).toHaveBeenCalledWith('cik:1000001', 20, 10);
    expect(response.body).toMatchObject({ limit: 10, offset: 20 });
  });

  it('GET /company/:ticker/filings?formType= filters by form type', async () => {
    await request(app.getHttpServer()).get('/company/EXMP/filings?formType=10-K').expect(200);

    expect(queryFilings).toHaveBeenCalledWith('cik:1000001 AND formType:"10-K"', 0, 50);
  });

  it.each(['limit=51', 'limit=0', 'limit=abc', 'offset=-1', 'offset=abc', 'offset=9951'])(
    'GET /company/:ticker/filings?%s is a 400 without querying filings',
    async (query) => {
      await request(app.getHttpServer()).get(`/company/EXMP/filings?${query}`).expect(400);
      expect(queryFilings).not.toHaveBeenCalled();
    },
  );

  it('GET /filing/:accessionNumber returns the filing', async () => {
    const response = await request(app.getHttpServer())
      .get('/filing/0000000000-26-000001')
      .expect(200);

    expect(queryFilings).toHaveBeenCalledWith('accessionNo:"0000000000-26-000001"', 0, 1);
    expect(response.body).toStrictEqual(filing);
  });

  it('GET /filing/:accessionNumber is a 404 when no filing matches', async () => {
    queryFilings.mockResolvedValue({ total: { value: 0, relation: 'eq' }, filings: [] });

    await request(app.getHttpServer()).get('/filing/0000000000-26-999999').expect(404);
  });
});
