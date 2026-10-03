const { test } = require('@playwright/test');
class BaseService {
resource = '';
constructor(request) {
this.request = request;
}
get(path = '', params) {
return this.send('GET', path, { params });
}
post(path, data) {
return this.send('POST', path, { data });
}
send(method, path, options) {
const url = `${this.resource}${path}`; 
return test.step(`${method} ${url}`, async () => {
const startedAt = Date.now();
const response = await this.request.fetch(url, {
method,
params: options.params, 
data: options.data, 
});
const result = {
status: response.status(),
ok: response.ok(), 
body: await BaseService.parseBody(response),
durationMs: Date.now() - startedAt,
};
await test.info().attach(`${method} ${url} -> ${result.status}`, {
contentType: 'application/json',
body: JSON.stringify({ request: { method, url, ...options }, response: result }, null, 2),
});
return result;
});
}
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