const shippingRateSchema = {
    type: 'object',
    required: ['id', 'userId', 'title', 'body'], // all four must be present
    additionalProperties: false, // any other field is an error (we own this service, so we're strict)
    properties: {
    id: { type: 'integer', minimum: 1 },
    userId: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1 }, // must not be empty
    body: { type: 'string', minLength: 1 },
    },
    };
    // A list of rates: an array with at least one item, where every item follows the schema above
    const shippingRateListSchema = {
    type: 'array',
    minItems: 1,
    items: shippingRateSchema,
    };
    module.exports = { shippingRateSchema, shippingRateListSchema };