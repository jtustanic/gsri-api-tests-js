const { defineConfig } = require('@playwright/test');
const { env } = require('./src/config/env');
module.exports = defineConfig({
testDir: './tests', fullyParallel: true, timeout: 30_000, // where to look for test files
// run tests at the same time, which is faster
// fail a test that takes longer than 30 seconds
outputDir: 'reports/test-results',
reporter: [
['list'], // one line per test in the terminal
['html', { open: 'never', outputFolder: 'reports/html' }], // web page report
['junit', { outputFile: 'reports/junit.xml' }], // XML report for CI tools like Jenkins
],
use: {
baseURL: env.baseUrl, // every request path is added to this URL
extraHTTPHeaders: { Accept: 'application/json' },
},
});