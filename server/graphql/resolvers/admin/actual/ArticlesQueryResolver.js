import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class ArticlesQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'articles'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // DB Related Errors
      ArticlesNotFound: '204.Q003.001',

      // Validation Errors
      InvalidPaginationInput: '203.Q003.002',
      InvalidLimitValue: '203.Q003.003',
      InvalidOffsetValue: '203.Q003.004',
      InvalidSortColumn: '203.Q003.005',
      InvalidSortOrder: '203.Q003.006',
      InvalidTagIds: '203.Q003.007',

      // Calculation Errors
      CannotCalculatePagination: '201.Q003.008',
    }
  }
}
