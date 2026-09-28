const { BaseService } = require('./BaseService');
// Customer Profile Service, mocked by /users
class CustomerProfileService extends BaseService {
resource = '/users';
getAllCustomers() {
return this.get(); // GET /users
}
getCustomerById(id) {
return this.get(`/${id}`); // GET /users/1
}
// For the bonus: customers whose username starts with a given letter.
// The API can't filter by "starts with", so we get all users and filter here.
async findCustomersByUsernameInitial(initial) {
const { ok, status, body } = await this.getAllCustomers();
if (!ok) throw new Error(`Customer lookup failed with HTTP ${status}`);
const prefix = initial.toLowerCase(); // case-insensitive: 'j' and 'J' behave the same
return body.filter((customer) => customer.username.toLowerCase().startsWith(prefix));
}
}
module.exports = { CustomerProfileService };