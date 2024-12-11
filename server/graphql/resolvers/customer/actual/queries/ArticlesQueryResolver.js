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
      ArticlesNotFound: '204.Q002.001',

      // Validation Errors
      InvalidInput: '203.Q002.002',
      InvalidTagIds: '203.Q002.003',

      // Pagination Input Validation
      InvalidPaginationLimit: '203.Q002.004',
      InvalidPaginationOffset: '203.Q002.005',

      // Sort Input Validation
      InvalidSortTargetColumn: '203.Q002.006',
      InvalidSortOrderBy: '203.Q002.007',

      // Calculation Errors
      CannotCalculatePagination: '201.Q002.008',

      // Implementation Errors
      FailedToProcessQuery: '201.Q002.009',
    }
  }
}
