import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class ArticleQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'article'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // DB Related Errors
      ArticleNotFound: '204.Q001.001',

      // Validation Errors
      InvalidInput: '203.Q001.002',
      InvalidArticleId: '203.Q001.003',

      // Implementation Errors
      FailedToProcessQuery: '201.Q001.004',

      // Tag Related Errors
      TagsNotFound: '204.Q001.005',
      FailedToFetchTags: '201.Q001.006',
    }
  }
}
