# GSRI API Test Suite (JavaScript)

Automated API test suite for the **Global Shipping Rate Integrator (GSRI)**, built with **Playwright Test and JavaScript**.

For this project, [JSONPlaceholder](https://jsonplaceholder.typicode.com) is used as a mock backend:

| GSRI service             | Mock endpoint |
| ------------------------ | ------------- |
| Shipping Rates Service   | `/posts`      |
| Customer Profile Service | `/users`      |

The suite covers functional, negative, contract/schema and basic state-related API testing.

## Tech Stack

* JavaScript (CommonJS)
* Playwright Test
* Node.js 18+
* Ajv / JSON Schema
* JSONPlaceholder
* HTML and JUnit reporting

## Install and run

### Prerequisites

* Node.js 18 or later
* npm

No browsers are required because this project only tests APIs.

```bash
npm install
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
npm test
```

### Other commands

| Command                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run test:smoke`    | Runs tests tagged with `@smoke`              |
| `npm run test:contract` | Runs JSON Schema / contract tests            |
| `npm run test:negative` | Runs negative API tests                      |
| `npm run report`        | Opens the HTML report from the last test run |

## Configuration

Environment-specific values are stored in `.env`.

| Variable              | Description                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| `BASE_URL`            | Base URL of the API under test. Required.                                                            |
| `API_PERSISTS_WRITES` | Defines whether POST requests are expected to persist data. Defaults to `false` for JSONPlaceholder. |

The tests do not contain hardcoded environment URLs.

## Test Coverage

The suite covers:

* Functional API testing
* Positive and negative scenarios
* JSON Schema / contract validation
* Referential integrity between services
* POST response validation
* Follow-up GET after POST
* Data-driven tests
* Custom Playwright matchers
* HTML and JUnit test reporting

## Reports

Each test run produces the following reports:

### Console

The Playwright `list` reporter shows the result of each test directly in the terminal.

### HTML report

The HTML report is generated in:

```text
reports/html
```

API calls are added as named test steps, for example:

```text
GET /posts/1
```

Request and response details are attached to the report as JSON, including:

* HTTP status
* response body
* request information
* duration

This makes it easier to investigate failed tests without manually reproducing the request.

### JUnit XML

JUnit results are generated in:

```text
reports/junit.xml
```

This format can be used by CI tools such as Jenkins, GitLab CI or Azure DevOps.

## Project Structure

```text
src/
  config/
    env.js                    Loads and validates environment configuration

  models/
    types.js                  JSDoc type definitions

  services/
    BaseService.js            Shared API request logic
    ShippingRatesService.js   Shipping Rates API methods
    CustomerProfileService.js Customer Profile API methods

  schemas/
    JSON Schemas used for response validation

  utils/
    schemaValidator.js        Ajv schema validation helper

  fixtures/
    index.js                  Test fixtures and custom matchers

  data/
    testData.js               Test data for data-driven tests

tests/
  functional.spec.js          Functional API scenarios
  state-persistence.spec.js   POST and follow-up GET scenarios
  contract.spec.js            JSON Schema validation
  negative.spec.js            Negative API scenarios
```

## Requirement Coverage

| Requirement                                                     | Test                        |
| --------------------------------------------------------------- | --------------------------- |
| A specific rate exists                                          | `functional.spec.js`        |
| `userId` maps to a valid customer                               | `functional.spec.js`        |
| Bonus: filter posts by username starting with a specific letter | `functional.spec.js`        |
| Create a quote and verify `201` response                        | `state-persistence.spec.js` |
| Bonus: GET the created quote                                    | `state-persistence.spec.js` |
| Validate API responses against JSON Schemas                     | `contract.spec.js`          |
| Handle non-existent rates                                       | `negative.spec.js`          |
| Handle unknown customers                                        | `negative.spec.js`          |

## Test Design

### Service layer

API calls are grouped into service classes:

```text
ShippingRatesService
CustomerProfileService
```

This keeps request details such as endpoints and HTTP methods outside the test files.

For example, tests can use:

```javascript
shippingRates.getRateById(1)
```

instead of building the request directly inside the test.

### Fixtures

Playwright fixtures are used to provide the service objects and custom matchers to the tests.

This keeps the test setup centralized and makes the tests easier to read.

### JSON Schema validation

API responses are validated against JSON Schemas using Ajv.

The schemas verify that responses have the expected structure and data types.

The Shipping Rate schema is strict and does not allow unexpected fields.

The Customer Profile schema validates the fields used by the GSRI tests while allowing additional fields from the upstream service.

### Custom matchers

The project includes custom matchers such as:

```text
toHaveStatus
toMatchSchema
```

This allows assertions to stay close to the requirements being tested.

## Assumptions and Limitations

### JSONPlaceholder does not persist POST data

JSONPlaceholder returns `201` for POST requests but does not actually store the created resource.

Because of this, the follow-up GET behaves differently from what would normally be expected from a real API.

The test uses `API_PERSISTS_WRITES` to handle both cases:

```text
false → expected behaviour for JSONPlaceholder
true  → expected behaviour for a persistent backend
```

For JSONPlaceholder, the test verifies the returned ID and the documented `404` response from the follow-up GET.

For a persistent backend, the test expects `200` and verifies the returned resource.

### Bonus username filter

The mock data does not contain a username starting with `J`, so the test expects an empty result for that case.

The same logic is also tested with letters that have matching users.

The filter is case-insensitive.

### Error handling

For a non-existent rate, JSONPlaceholder returns:

```json
{}
```

with HTTP status `404`.

The negative test validates this behaviour.

A real API could return a more detailed error response, in which case the assertion would be adapted to the actual API contract.

### Test data

The POST scenarios include different quote examples, including:

* domestic shipment
* international shipment
* non-ASCII characters such as `Zürich → Kraków`

Because JSONPlaceholder does not provide real shipping-rate calculation, pricing information is represented as test data in the request body.

### Authentication

JSONPlaceholder is a public API, so authentication is not required for this project.

For an authenticated API, credentials or tokens should be stored in environment variables or CI secrets rather than directly in the test code.

### Invalid POST payloads

Invalid POST payload validation is not included because JSONPlaceholder accepts arbitrary request bodies.

For a real GSRI API, additional negative tests would cover scenarios such as:

* missing required fields
* incorrect data types
* invalid `userId`
* invalid field values

Expected responses would depend on the actual API contract, for example `400` or `422`.

## Why Playwright?

Playwright Test was selected because it provides an API testing client through `APIRequestContext` together with a test runner, fixtures, assertions, tags, retries and reporting.

It also makes it possible to extend the same project with UI or end-to-end testing later if needed.

The project uses plain JavaScript instead of TypeScript to keep the setup simple and avoid a compilation step. JSDoc types are used where additional editor support is useful.

## Future Improvements

Possible next steps for a real API environment would be:

* Add authentication handling
* Add more negative scenarios
* Add request payload/schema validation
* Add API response time assertions
* Add environment-specific configuration for