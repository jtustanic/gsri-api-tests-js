const { test, expect } = require('../src/fixtures');
const { env } = require('../src/config/env');
const { shippingQuotes } = require('../src/data/testData');
const { shippingRateSchema } = require('../src/schemas/shippingRate.schema');
test.describe('State persistence: POST /posts', () => {
for (const { scenario, quote } of shippingQuotes) {
test(`creates a quote (${scenario})`, { tag: '@smoke' }, async ({ shippingRates }) => {
const created = await shippingRates.createQuote(quote);
expect(created).toHaveStatus(201);
expect(created.body).toMatchObject(quote); // the response contains everything we sent (plus an id)
expect(created.body).toMatchSchema(shippingRateSchema);
});
test(`follow-up GET after creating a quote (${scenario})`, async ({ shippingRates }) => {
const created = await shippingRates.createQuote(quote);
expect(created).toHaveStatus(201);
const fetched = await shippingRates.getRateById(created.body.id);
if (env.apiPersistsWrites) {
// A real backend: the quote must come back exactly as it was created
expect(fetched).toHaveStatus(200);
expect(fetched.body).toEqual(created.body);
} else {
// JSONPlaceholder: nothing is saved, but the new id is the next one in sequence
test.info().annotations.push({
type: 'simulated persistence',
description: `Backend does not persist writes; GET /posts/${created.body.id} is expected to return 404.`,
});
const rates = await shippingRates.getAllRates();
expect(rates).toHaveStatus(200);
const highestExistingId = Math.max(...rates.body.map((r) => r.id));
expect(created.body.id, 'the new quote should get the next id').toBe(highestExistingId + 1);
expect(fetched).toHaveStatus(404);
}
});
}
});