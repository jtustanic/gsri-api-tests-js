const Ajv = require('ajv');
const addFormats = require('ajv-formats');
// allErrors: report every problem, not just the first one
const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // adds support for format: 'email'
// Returns { valid: true/false, errors: [readable messages] }
function validateAgainstSchema(schema, data) {
const validate = ajv.compile(schema); // turns the schema into a checking function
const valid = validate(data);
const errors = (validate.errors ?? []).map((e) => `${e.instancePath || '(root)'} ${e.message}`);
return { valid, errors };
}
module.exports = { validateAgainstSchema };