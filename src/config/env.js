require('dotenv/config');

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}". Copy .env.example to .env.`);
  }
  return value;
}

const env = Object.freeze({
  baseUrl: required('BASE_URL'),
  apiPersistsWrites: process.env.API_PERSISTS_WRITES === 'true',
});

module.exports = { env };