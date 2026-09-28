const { test } = require('@playwright/test');
class BaseService {
// Each child class sets its own path, e.g. '/posts'
resource = '';
// The constructor runs when you do `new ShippingRatesService(request)`.
// It stores Playwright's HTTP client so the methods can use it.
constructor(request) {
this.request = request;
}
// Short helpers. `path = ''` means "empty if not given".
get(path = '', params) {
return this.send('GET', path, { params });
}
post(path, data) {
return this.send('POST', path, { data });
}
// The one place where a request is actually sent
send(method, path, options) {
const url = `${this.resource}${path}`; // e.g. '/posts' + '/1' = '/posts/1'
// test.step shows up as a named step (e.g. "GET /posts/1") in the HTML report
return test.step(`${method} ${url}`, async () => {
const startedAt = Date.now();
const response = await this.request.fetch(url, {
method,
params: options.params, // query string, e.g. ?userId=1
data: options.data, // JSON body for POST
});
// Turn the response into a simple object that is easy to assert on
const result = {
status: response.status(),
ok: response.ok(), // true for 2xx statuses
body: await BaseService.parseBody(response),
durationMs: Date.now() - startedAt,
};
// Attach the full request and response to the report, for debugging failures
await test.info().attach(`${method} ${url} -> ${result.status}`, {
contentType: 'application/json',
body: JSON.stringify({ request: { method, url, ...options }, response: result }, null, 2),
});
return result;
});
}
// Turns the response text into JSON, and copes with empty or non-JSON bodies
static async parseBody(response) {
const text = await response.text();
if (!text) return undefined;
try {
return JSON.parse(text);
} catch {
return text;
}
}
}
module.exports = { BaseService };