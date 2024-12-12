import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class AdminsQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'admins'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // DB Related Errors
      AdminNotFound: '204.Q001.001',

      // Validation Errors
      InvalidPaginationInput: '203.Q001.002',
      InvalidLimitValue: '203.Q001.003',
      InvalidOffsetValue: '203.Q001.004',
      InvalidSortColumn: '203.Q001.005',
      InvalidSortOrder: '203.Q001.006',

      // Calculation Errors
      CannotCalculatePagination: '201.Q001.007',
    }
  }
}
