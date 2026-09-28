const { test, expect } = require('../src/fixtures');
const { nonExistentRateIds, unknownCustomerId } = require('../src/data/testData');
test.describe('Negative testing', { tag: '@negative' }, () => {
for (const { label, id } of nonExistentRateIds) {
test(`GET /posts/{id} returns 404 for ${label} (${id})`, async ({ shippingRates }) => {
const rate = await shippingRates.getRateById(id);
expect(rate).toHaveStatus(404);
expect(rate.body).toEqual({}); // JSONPlaceholder returns an empty object for "not found"
});
}
test('GET /users/{id} returns 404 for an unknown customer', async ({ customerProfiles }) => {
const customer = await customerProfiles.getCustomerById(unknownCustomerId);
expect(customer).toHaveStatus(404);
expect(customer.body).toEqual({});
});
test('rates lookup for an unknown customer returns an empty list, not an error', async ({ shippingRates }) => {
    const rates = await shippingRates.getRatesByCustomer(unknownCustomerId);
    expect(rates).toHaveStatus(200);
    expect(rates.body).toEqual([]);
    });
    });