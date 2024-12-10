import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class ArticleQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'article'
  }

  /**
   * Resolve the customer query
   *
   * @param {*} params - Parameters.
   * @returns {Promise<object>}
   */
  async resolve ({
    context,
  }) {
    return {
      articleId: 10001,
      thumbnail: 'https://openreach.tech/assets/images/logo.png',
      title: '記事タイトルサンプル',
      content: '# 記事タイトル \n ## 記事サブタイトル',
      postedAt: new Date('2024-01-01T00:00:00Z'),
      tags: [
        {
          tagId: 10011,
          name: 'タグ1',
        },
      ],
    }
  }
}
