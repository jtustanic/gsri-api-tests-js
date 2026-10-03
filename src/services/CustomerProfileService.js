const { BaseService } = require('./BaseService');

class CustomerProfileService extends BaseService {
resource = '/users';
getAllCustomers() {
return this.get(); // GET /users
}
getCustomerById(id) {
return this.get(`/${id}`); // GET /users/1
}

async findCustomersByUsernameInitial(initial) {
const { ok, status, body } = await this.getAllCustomers();
if (!ok) throw new Error(`Customer lookup failed with HTTP ${status}`);
const prefix = initial.toLowerCase(); 
return body.filter((customer) => customer.username.toLowerCase().startsWith(prefix));
}
}
module.exports = { CustomerProfileService };