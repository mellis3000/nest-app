import { setApiKey } from 'sec-api';
import { SecApiClient } from './sec-api.client.js';

const getFilings = vi.hoisted(() => vi.fn().mockResolvedValue({ total: {}, filings: [] }));

vi.mock('sec-api', () => ({
  setApiKey: vi.fn(),
  mappingApi: { resolve: vi.fn() },
  queryApi: { getFilings },
}));

describe('SecApiClient', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('refuses to start without SEC_API_KEY', () => {
    vi.stubEnv('SEC_API_KEY', '');

    expect(() => new SecApiClient()).toThrow('SEC_API_KEY');
  });

  it('sets the API key from SEC_API_KEY', () => {
    vi.stubEnv('SEC_API_KEY', 'test-key');

    new SecApiClient();

    expect(setApiKey).toHaveBeenCalledWith('test-key');
  });

  it('requests the given page sorted by filing date, newest first', async () => {
    vi.stubEnv('SEC_API_KEY', 'test-key');

    await new SecApiClient().queryFilings('cik:1000001', 20, 10);

    expect(getFilings).toHaveBeenCalledWith({
      query: 'cik:1000001',
      from: '20',
      size: '10',
      sort: [{ filedAt: { order: 'desc' } }],
    });
  });
});
