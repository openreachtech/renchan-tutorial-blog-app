import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class ArticleStatusesQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'articleStatuses'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // DB Related Errors
      StatusesNotFound: '204.Q004.001',

      // Calculation Errors
      CannotRetrieveStatus: '201.Q004.002',
    }
  }
}
