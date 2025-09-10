import {
  BaseQueryResolver,
} from '@openreachtech/renchan'
import Customer from '../../../../../../sequelize/models/Customer.js';
import CustomerBasic from '../../../../../../sequelize/models/CustomerBasic.js';
import CustomerSecret from '../../../../../../sequelize/models/CustomerSecret.js';

export default class CustomerQueryPaginationResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'customerPagination'
  }

  async paginateCustomers({ page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  const { count, rows: customers } = await Customer.findAndCountAll({
    offset,
    limit,
    order: [['registeredAt', 'DESC']],
    include: [
      { model: CustomerBasic, attributes: ['username'] },
      { model: CustomerSecret, attributes: ['email'] },
    ],
  });

  const data = customers.map(c => ({
    id: c.get('id'),
    username: c.get('CustomerBasic')?.get('username') ?? null,
    email: c.get('CustomerSecret')?.get('email') ?? null,
    registeredAt: c.get('registeredAt'),
  }));

  return {
    data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}
  /** @override */
  async resolve({ variables }) {
    const { page = 1, limit = 10 } = variables.customerPaginationInput || {};
    return this.paginateCustomers({ page, limit });
  }

}
