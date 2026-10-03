const shippingRateSchema = {
    type: 'object',
    required: ['id', 'userId', 'title', 'body'], 
    additionalProperties: false, 
    properties: {
    id: { type: 'integer', minimum: 1 },
    userId: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1 }, // must not be empty
    body: { type: 'string', minLength: 1 },
    },
    };
    const shippingRateListSchema = {
    type: 'array',
    minItems: 1,
    items: shippingRateSchema,
    };
    module.exports = { shippingRateSchema, shippingRateListSchema };