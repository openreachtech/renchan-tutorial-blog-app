import {
  BaseQueryResolver,
} from '@openreachtech/renchan'
import Customer from '../../../../../../sequelize/models/Customer.js';
import CustomerBasic from '../../../../../../sequelize/models/CustomerBasic.js';
import CustomerSecret from '../../../../../../sequelize/models/CustomerSecret.js';

export default class CustomerQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'customerById'
  }

  /** @override */
  async resolve({ variables }) {
    const { id } = variables || {};

    const [customer, customerBasic, customerSecret] = await Promise.all([
      Customer.findOne({
        where: {
          id : id,
        },
      }),
      CustomerBasic.findOne({
        where: {
          CustomerId: id,
        },
      }),
      CustomerSecret.findOne({
        where: {
          CustomerId: id,
        },
      }),
    ])
    
    const data = {
      id: customer.id,
      username: customerBasic.username,
      email: customerSecret.email,
      registeredAt: customer.registeredAt,
    }
    
    return data
   }
}
