import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

import Article from '../../../../../../sequelize/models/Article'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail'
import ArticleTag from '../../../../../../sequelize/models/ArticleTag'
import Tag from '../../../../../../sequelize/models/Tag'

export default class ArticleQueryResolver extends BaseQueryResolver {
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

  /**
   * Resolve article query
   *
   * @param {{
   *   input: graphqlCustomer.ArticleInput
   * }} params
   * @returns {Promise<graphqlCustomer.Article>}
   */
  async resolve ({
    input: {
      articleId,
    },
  }) {
    if (!this.isArticleIdValid({
      articleId,
    })) {
      throw this.errorHash.InvalidArticleId.create()
    }

    const article = await this.findArticle({
      articleId,
    })

    if (!article) {
      throw this.errorHash.ArticleNotFound.create()
    }

    return this.formatResponse({
      article,
    })
  }

  /**
   * Validate article ID
   *
   * @param {{
   *   articleId: number
   * }} params
   * @returns {boolean}
   */
  isArticleIdValid ({
    articleId,
  }) {
    return Number.isInteger(articleId) && articleId > 0
  }

  /**
   * Find article by ID
   *
   * @param {{
   *   articleId: number
   * }} params
   * @returns {Promise<model.ArticleWithAssociationsEntity>}
   */
  async findArticle ({
    articleId,
  }) {
    return Article.findOne({
      where: {
        id: articleId,
      },
      include: [
        ArticleThumbnail,
        {
          model: ArticleTag,
          include: [Tag],
        },
      ],
    })
  }

  /**
   * Format response data
   *
   * @param {{
   *   article: model.ArticleWithAssociationsEntity
   * }} params
   * @returns {graphqlCustomer.Article}
   */
  formatResponse ({
    article,
  }) {
    return {
      articleId: article.id,
      thumbnailUrl: article.ArticleThumbnail.imageUrl,
      title: article.title,
      content: article.content,
      postedAt: article.postedAt,
      tags: article.ArticleTags.map(articleTag => ({
        tagId: articleTag.Tag.id,
        name: articleTag.Tag.name,
      })),
    }
  }

  /** @inheritdoc */
  get schema () {
    return 'article'
  }
}
