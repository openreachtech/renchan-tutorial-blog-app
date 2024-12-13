import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

import Article from '../../../../../../sequelize/models/Article'
import Tag from '../../../../../../sequelize/models/Tag'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail'
import ArticleTag from '../../../../../../sequelize/models/ArticleTag'

export default class ArticleQueryResolver extends BaseQueryResolver {
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

  /**
   * Resolve the article query
   *
   * @param {{
   *   input: {
   *     articleId: number
   *   }
   * }} params
   * @param {renchanMiddleware.AdminContext} context
   * @returns {Promise<graphqlAdmin.Article>}
   */
  async resolve (
    {
      input,
    },
    context
  ) {
    const { articleId } = input

    if (!this.isArticleIdValid({ articleId })) {
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
    return Number.isInteger(articleId)
      && articleId > 0
  }

  /**
   * Find article by ID
   *
   * @param {{
   *   articleId: number
   * }} params
   * @returns {Promise<ArticleAssociatedEntity>}
   */
  async findArticle ({
    articleId,
  }) {
    return Article.findOne({
      where: {
        id: articleId,
      },
      include: [
        {
          model: ArticleThumbnail,
        },
        {
          model: ArticleTag,
          include: [Tag],
        },
      ],
    })
  }

  /**
   * Format the response
   *
   * @param {{
   *   article: ArticleAssociatedEntity
   * }} params
   * @returns {graphqlAdmin.Article}
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
      savedAt: article.savedAt,
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

/**
 * @typedef {model.Article & {
 *   ArticleThumbnail: model.ArticleThumbnail
 *   ArticleTags: Array<model.ArticleTag & {
 *     Tag: model.Tag
 *   }>
 * }} ArticleAssociatedEntity
 */
