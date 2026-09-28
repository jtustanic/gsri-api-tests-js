# GSRI API Test Suite (JavaScript)

Automated API test suite for the **Global Shipping Rate Integrator (GSRI)**, built with **Playwright Test and JavaScript**.

For this assignment, [JSONPlaceholder](https://jsonplaceholder.typicode.com) is used as a mock backend:

| GSRI service             | Mock endpoint |
| ------------------------ | ------------- |
| Shipping Rates Service   | `/posts`      |
| Customer Profile Service | `/users`      |

The suite covers functional, negative, contract/schema and POST-related API scenarios.

## Tech Stack

* JavaScript (CommonJS)
* Playwright Test
* Ajv / JSON Schema
* Node.js 18+
* JSONPlaceholder

## Installation and Running Tests

### Prerequisites

* Node.js 18+
* npm

No browsers are required because this project only tests APIs.

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Run all tests:

```bash
npm test
```

### Other commands

```bash
npm run test:smoke
npm run test:contract
npm run test:negative
npm run report
```

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `test:smoke`    | Runs tests tagged `@smoke`              |
| `test:contract` | Runs JSON Schema / contract tests       |
| `test:negative` | Runs negative API tests                 |
| `report`        | Opens the HTML report from the last run |

## Configuration

Environment-specific values are stored in `.env`.

| Variable              | Description                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| `BASE_URL`            | Base URL of the API under test                                                                       |
| `API_PERSISTS_WRITES` | Defines whether POST requests are expected to persist data. Defaults to `false` for JSONPlaceholder. |

No environment-specific URLs are hardcoded in the tests.

## Test Coverage

The test suite covers:

* Retrieving specific shipping rates
* Validating `userId` references against the Customer Profile service
* Filtering users/posts by username
* Creating a quote and validating the `201` response
* Follow-up GET after POST
* JSON Schema validation
* Non-existent resources and error handling
* Data-driven test scenarios

## Project Structure

```text
src/
  config/env.js
  models/types.js
  services/
    BaseService.js
    ShippingRatesService.js
    CustomerProfileService.js
  schemas/
  utils/schemaValidator.js
  fixtures/index.js
  data/testData.js

tests/
  functional.spec.js
  state-persistence.spec.js
  contract.spec.js
  negative.spec.js
```

## Why These Tools?

### Playwright Test

Playwright was chosen because its `APIRequestContext` provides a built-in HTTP client, while the test runner provides fixtures, assertions, tags, retries and reporting.

It also allows the project to be extended with UI or end-to-end tests in the future if needed.

### JavaScript

Plain JavaScript keeps the project simple and requires no compilation step. JSDoc is used where type information improves readability and editor support.

### Ajv / JSON Schema

Ajv is used to validate API responses against JSON Schemas. This provides an explicit contract for the expected response structure and data types.

### Service Objects

API requests are grouped into service classes instead of being implemented directly in each test. This keeps endpoint details and request logic in one place and makes the tests easier to read and maintain.

## Assumptions

1. **JSONPlaceholder does not persist POST requests.**
   A POST returns `201`, but the created resource is not actually stored. The test suite therefore uses `API_PERSISTS_WRITES=false` by default and handles the follow-up GET accordingly.

2. **The mock data does not contain a username starting with `J`.**
   The corresponding bonus test therefore expects an empty result. Other letters with matching users are also tested to verify the filtering logic.

3. **A missing rate returns `404` with an empty JSON object `{}`.**
   This reflects JSONPlaceholder's behaviour and is what the negative test validates.

4. **The Customer Profile schema allows additional fields.**
   Only the fields required by the GSRI tests are validated, so unrelated fields added by the upstream service do not break the test.

5. **No authentication is required.**
   JSONPlaceholder is public. For a real authenticated environment, credentials would be provided through environment variables or CI secrets.

6. **Invalid POST payload validation is not included.**
   JSONPlaceholder accepts arbitrary POST bodies, so testing invalid payloads against the mock would not provide meaningful validation. Against a real GSRI API, cases such as missing fields, invalid types and invalid `userId` values would be added.

## Reports

The test run generates:

* **HTML report:** `reports/html`
* **JUnit report:** `reports/junit.xml`
* **Console output:** Playwright `list` reporter
