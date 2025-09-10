import {
  BaseQueryResolver,
} from '@openreachtech/renchan'
import Customer from '../../../../../../sequelize/models/Customer.js'
import CustomerBasic from '../../../../../../sequelize/models/CustomerBasic.js'
import CustomerSecret from '../../../../../../sequelize/models/CustomerSecret.js'

export default class CustomerQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'customer'
  }

  static async findCustomerDetail(id) {
    return Customer.findOne({
      where: { id },
      include: [
        { model: CustomerBasic, attributes: ['username'] },
        { model: CustomerSecret, attributes: ['email'] },
      ],
      attributes: ['id', 'registeredAt'],
    })
  }

  static async formatCustomerDetail(customerDetail) {
    return {
      id: customerDetail.id,
      username: customerDetail.CustomerBasic.username,
      email: customerDetail.CustomerSecret.email,
      registeredAt: customerDetail.registeredAt,
    }
  }


  /** @override */
  async resolve () {
    return {
      id: 100,
      name: 'actual John Doe',
      inviteCode: 'abcd0123',
    }
  }
}
