const { test, expect } = require('../src/fixtures');
const { shippingRateSchema, shippingRateListSchema } = require('../src/schemas/shippingRate.schema');
const { customerProfileSchema, customerProfileListSchema } = require('../src/schemas/customerProfile.schema');
const { shippingQuotes } = require('../src/data/testData');
// The tag on describe applies to every test inside it
test.describe('Contract / schema validation', { tag: '@contract' }, () => {
test('GET /posts/{id} matches the shipping rate contract', async ({ shippingRates }) => {
const rate = await shippingRates.getRateById(1);
expect(rate).toHaveStatus(200);
expect(rate.body).toMatchSchema(shippingRateSchema);
});
test('GET /posts returns a list where every item matches the contract', async ({ shippingRates }) => {
const rates = await shippingRates.getAllRates();
expect(rates).toHaveStatus(200);
expect(rates.body).toMatchSchema(shippingRateListSchema);
});
test('POST /posts response matches the shipping rate contract', async ({ shippingRates }) => {
const created = await shippingRates.createQuote(shippingQuotes[0].quote);
expect(created).toHaveStatus(201);
expect(created.body).toMatchSchema(shippingRateSchema);
});
test('GET /users/{id} matches the customer profile contract', async ({ customerProfiles }) => {
const customer = await customerProfiles.getCustomerById(1);
expect(customer).toHaveStatus(200);
expect(customer.body).toMatchSchema(customerProfileSchema);
});
test('GET /users returns a list where every item matches the contract', async ({ customerProfiles }) => {
const customers = await customerProfiles.getAllCustomers();
expect(customers).toHaveStatus(200);
expect(customers.body).toMatchSchema(customerProfileListSchema);
});
// Proves the schema can actually fail. A schema that accepts anything is useless.
test('the schema check rejects payloads that break the contract', () => {
// id is text, not a number
expect({ id: '1', userId: 1, title: 'x', body: 'y' }).not.toMatchSchema(shippingRateSchema);
// body is missing
expect({ id: 1, userId: 1, title: 'x' }).not.toMatchSchema(shippingRateSchema);
// extra field
expect({ id: 1, userId: 1, title: 'x', body: 'y', price: 9.99 }).not.toMatchSchema(shippingRateSchema);
});
});