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
      ArticleNotFound: '204.Q002.001',

      // Validation Errors
      InvalidArticleId: '203.Q002.002',

      // Calculation Errors
      CannotRetrieveArticle: '201.Q002.003',
    }
  }
}
