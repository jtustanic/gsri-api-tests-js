
const { test: base, expect: baseExpect } = require('@playwright/test');
const { ShippingRatesService } = require('../services/ShippingRatesService');
const { CustomerProfileService } = require('../services/CustomerProfileService');
const { validateAgainstSchema } = require('../utils/schemaValidator');

// Create custom fixtures
const test = base.extend({
  shippingRates: async ({ request }, use) => {
    await use(new ShippingRatesService(request));
  },
  customerProfiles: async ({ request }, use) => {
    await use(new CustomerProfileService(request));
  },
});

// Add custom matchers
const expect = baseExpect.extend({
  toHaveStatus(received, expected) {
    const pass = received.status === expected;
    return {
      pass,
      message: () =>
        `Expected HTTP ${expected}${pass ? ' not' : ''} to be returned, got ${received.status}.\n` +
        `Response body: ${JSON.stringify(received.body, null, 2)}`,
    };
  },

  toMatchSchema(received, schema) {
    const { valid, errors } = validateAgainstSchema(schema, received);
    return {
      pass: valid,
      message: () =>
        valid
          ? 'Expected data not to match the schema, but it did.'
          : `Schema validation failed:\n - ${errors.join('\n - ')}`,
    };
  },
});

module.exports = { test, expect };