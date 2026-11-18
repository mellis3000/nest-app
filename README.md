# nest-app

A NestJS API over [sec-api.io](https://sec-api.io) for looking up companies and their SEC filings.

## Run

Requires Node 20.11+ and an API key from [sec-api.io](https://sec-api.io/signup).

```bash
npm install
SEC_API_KEY=your-key npm run start:dev
```

The API listens on http://localhost:3000; set `PORT` to change it.

## Endpoints

| Endpoint                       | Returns                                         |
| ------------------------------ | ----------------------------------------------- |
| `GET /company/:ticker`         | The company for a ticker, e.g. `/company/AAPL`  |
| `GET /company/:ticker/filings` | The company's filings, newest first             |
| `GET /filing/:accessionNumber` | One filing, e.g. `/filing/0001477932-26-007139` |

`/company/:ticker/filings` takes optional query parameters:

- `limit`: 1–50, default 50
- `offset`: default 0; `offset + limit` cannot exceed 10,000
- `formType`: exact form type, e.g. `10-K` or `10-K/A`

## Test

```bash
npm test
```
