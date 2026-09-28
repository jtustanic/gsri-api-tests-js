const { test, expect } = require('../src/fixtures');
const { existingRateIds, usernameInitialCases } = require('../src/data/testData');
test.describe('Functional validation: GET /posts/{id}', () => {
// One test per id in existingRateIds
for (const rateId of existingRateIds) {
test(`rate #${rateId} exists and belongs to a valid customer`, { tag: '@smoke' },
async ({ shippingRates, customerProfiles }) => {
// 1. The rate exists
const rate = await shippingRates.getRateById(rateId);
expect(rate).toHaveStatus(200);
expect(rate.body.id).toBe(rateId);
// 2. Its userId points to a real customer
const customer = await customerProfiles.getCustomerById(rate.body.userId);
expect(customer, `userId ${rate.body.userId} should resolve to a customer`).toHaveStatus(200);
expect(customer.body.id).toBe(rate.body.userId);
});
}
// Extra: check ALL rates at once, not just three
test('every rate references an existing customer', async ({ shippingRates, customerProfiles }) => {
// Promise.all sends both requests at the same time and waits for both
const [rates, customers] = await Promise.all([
shippingRates.getAllRates(),
customerProfiles.getAllCustomers(),
]);
expect(rates).toHaveStatus(200);
expect(customers).toHaveStatus(200);
const customerIds = new Set(customers.body.map((c) => c.id)); // e.g. {1, 2, ..., 10}
const orphanRates = rates.body.filter((r) => !customerIds.has(r.userId)); // rates with no customer
expect(orphanRates, 'rates whose userId has no matching customer').toEqual([]);
});
});
test.describe('Bonus: rates of customers by username initial', () => {
for (const { initial, expectedUsernames } of usernameInitialCases) {
test(`fetches rates for customers whose username starts with "${initial}"`,
async ({ shippingRates, customerProfiles }) => {
const customers = await customerProfiles.findCustomersByUsernameInitial(initial);
// .sort() so the order doesn't matter
expect(customers.map((c) => c.username).sort()).toEqual([...expectedUsernames].sort());
if (customers.length === 0) {
// Adds a visible note to this test in the HTML report
test.info().annotations.push({ type: 'note', description: `No username starts with "${initial}".` });
}
for (const customer of customers) {
const rates = await shippingRates.getRatesByCustomer(customer.id);
expect(rates).toHaveStatus(200);
expect(rates.body.length).toBeGreaterThan(0);
expect(rates.body.every((r) => r.userId === customer.id)).toBe(true); // all belong to this customer
}
});
}
});