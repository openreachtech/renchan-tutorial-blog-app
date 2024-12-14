import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class AddNewArticleMutationResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'addNewArticle'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // Validation Errors
      InvalidInput: '203.M001.001',
      InvalidThumbnailUrl: '203.M001.002',
      InvalidTitle: '203.M001.003',
      InvalidContent: '203.M001.004',
      InvalidPostedAt: '203.M001.005',
      InvalidTagIds: '203.M001.006',
      InvalidStatusId: '203.M001.007',

      // DB Related Errors
      ArticleCreationFailed: '204.M001.008',
      TagsNotFound: '204.M001.009',
      StatusNotFound: '204.M001.010',
    }
  }
}
