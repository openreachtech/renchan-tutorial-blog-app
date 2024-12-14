import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class UpdateArticleMutationResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'updateArticle'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // Validation Errors
      InvalidInput: '203.M003.001',
      InvalidArticleId: '203.M003.002',
      InvalidThumbnailUrl: '203.M003.003',
      InvalidTitle: '203.M003.004',
      InvalidContent: '203.M003.005',
      InvalidPostedAt: '203.M003.006',
      InvalidTagIds: '203.M003.007',
      InvalidStatusId: '203.M003.008',

      // DB Related Errors
      ArticleNotFound: '204.M003.009',
      ArticleUpdateFailed: '204.M003.010',
      TagsNotFound: '204.M003.011',
      StatusNotFound: '204.M003.012',
    }
  }
}
