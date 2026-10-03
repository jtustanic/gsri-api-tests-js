const nonEmptyString = { type: 'string', minLength: 1 };
const customerProfileSchema = {
type: 'object',
required: ['id', 'name', 'username', 'email', 'address'],
properties: {
id: { type: 'integer', minimum: 1 },
name: nonEmptyString,
username: nonEmptyString,
email: { type: 'string', format: 'email' }, 
address: {
type: 'object',
required: ['street', 'city', 'zipcode'],
properties: { street: nonEmptyString, city: nonEmptyString, zipcode: nonEmptyString },
},
},
};
const customerProfileListSchema = { type: 'array', minItems: 1, items: customerProfileSchema };
module.exports = { customerProfileSchema, customerProfileListSchema };