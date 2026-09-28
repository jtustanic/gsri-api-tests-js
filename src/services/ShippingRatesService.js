const { BaseService } = require('./BaseService');
// Shipping Rates Service, mocked by /posts
class ShippingRatesService extends BaseService {
resource = '/posts';
getAllRates() {
return this.get(); // GET /posts
}
getRateById(id) {
return this.get(`/${id}`); // GET /posts/1
}
getRatesByCustomer(userId) {
return this.get('', { userId }); // GET /posts?userId=1
}
createQuote(quote) {
return this.post('', quote); // POST /posts with a JSON body
}
}
module.exports = { ShippingRatesService };