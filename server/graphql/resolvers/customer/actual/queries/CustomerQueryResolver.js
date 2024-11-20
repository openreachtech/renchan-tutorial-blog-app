import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class CustomerQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'customer'
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
