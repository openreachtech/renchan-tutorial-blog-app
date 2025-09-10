import {
  BaseQueryResolver,
} from '@openreachtech/renchan'
import Customer from '../../../../../../sequelize/models/Customer.js';
import CustomerBasic from '../../../../../../sequelize/models/CustomerBasic.js';
import CustomerSecret from '../../../../../../sequelize/models/CustomerSecret.js';
import CustomerQueryResolver from './CustomerQueryResolver.js';

export default class CustomerQueryByIdResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'customerById'
  }

  /** @override */
  async resolve({ variables }) {
    const { id } = variables || {};

    const customer = await CustomerQueryResolver.findCustomerDetail(id);

    const data = CustomerQueryResolver.formatCustomerDetail(customer);
    
    return data
   }
}
