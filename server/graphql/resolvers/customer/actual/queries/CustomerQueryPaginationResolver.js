import {
  BaseQueryResolver,
} from '@openreachtech/renchan'
import Customer from '../../../../../../sequelize/models/Customer.js';
import CustomerBasic from '../../../../../../sequelize/models/CustomerBasic.js';
import CustomerSecret from '../../../../../../sequelize/models/CustomerSecret.js';

export default class CustomerQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'customerPagination'
  }

  /** @override */
  async resolve({variables}) {
    const { page, limit = 10 } = variables.customerPaginationInput || {};
    const offset = (page - 1) * limit;

    const { count, rows: customers } = await Customer.findAndCountAll({
      offset,
      limit,
      order: [['registeredAt', 'DESC']],
    });

    const customerIds = customers.map(c => c.get('id'));

    const [basics, secrets] = await Promise.all([
      CustomerBasic.findAll({
        where: { CustomerId: customerIds },
      }),
      CustomerSecret.findAll({
        where: { CustomerId: customerIds },
      }),
    ]);

    const data = customers.map(c => {
      const id = c.get('id');
      const basic = basics.find(b => b.get('CustomerId') === id);
      const secret = secrets.find(s => s.get('CustomerId') === id);

      return {
        id,
        username: basic?.get('username') ?? null,
        email: secret?.get('email') ?? null,
        registeredAt: c.get('registeredAt'),
      };
    });

    const total = Math.ceil(count / limit);

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: total,
    };
  }

}
