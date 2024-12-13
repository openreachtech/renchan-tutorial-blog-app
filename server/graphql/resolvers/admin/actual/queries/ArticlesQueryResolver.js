import {
  Op,
} from 'sequelize'
import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

import Article from '../../../../../../sequelize/models/Article.js'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail.js'
import ArticleTag from '../../../../../../sequelize/models/ArticleTag.js'
import Tag from '../../../../../../sequelize/models/Tag.js'

export default class ArticlesQueryResolver extends BaseQueryResolver {
  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // Validation Errors
      InvalidLimitValue: '203.Q003.001',
      InvalidOffsetValue: '203.Q003.002',
      InvalidSortColumn: '203.Q003.003',
      InvalidSortOrder: '203.Q003.004',
      InvalidTagIds: '203.Q003.005',
      InvalidPaginationInput: '203.Q003.006',

      // DB Related Errors
      ArticlesNotFound: '204.Q003.007',

      // Calculation Errors
      CannotCalculatePagination: '201.Q003.008',
    }
  }

  /**
   * Resolve the articles query
   *
   * @param {{
   *   input: {
   *     tagIds: number[],
   *     pagination: {
   *       limit: number,
   *       offset: number,
   *       sort?: {
   *         targetColumn: string,
   *         orderBy: string
   *       }
   *     }
   *   }
   * }} params
   * @param {renchanMiddleware.AdminContext} context
   * @returns {Promise<graphqlAdmin.ArticlesResult>}
   */
  async resolve (
    {
      input: {
        tagIds,
        pagination: {
          offset,
          limit,
          sort = {
            targetColumn: 'postedAt',
            orderBy: 'DESC',
          },
        },
      },
    },
    context
  ) {
    if (!this.isPaginationValid({
      pagination: {
        limit,
        offset,
        sort,
      },
    })) {
      throw this.errorHash.InvalidPaginationInput.create()
    }

    if (!this.isTagIdsValid({ tagIds })) {
      throw this.errorHash.InvalidTagIds.create()
    }

    const articles = await this.findArticles({
      tagIds,
      pagination: {
        limit,
        offset,
        sort,
      },
    })
    const totalRecords = await this.countArticles({ tagIds })

    return this.formatResponse({
      articles,
      pagination: {
        limit,
        offset,
        sort,
        totalRecords,
      },
    })
  }

  /**
   * Validate pagination input
   *
   * @param {{
   *   pagination: {
   *     limit: number,
   *     offset: number,
   *     sort?: {
   *       targetColumn: string,
   *       orderBy: string
   *     }
   *   }
   * }} params
   * @returns {boolean}
   */
  isPaginationValid ({
    pagination: {
      limit,
      offset,
      sort = {
        targetColumn: 'postedAt',
        orderBy: 'DESC',
      },
    },
  }) {
    if (!Number.isInteger(limit) || limit <= 0) {
      return false
    }

    if (!Number.isInteger(offset) || offset < 0) {
      return false
    }

    const validColumns = ['postedAt', 'savedAt']
    const validOrders = ['ASC', 'DESC']

    if (!validColumns.includes(sort.targetColumn)) {
      return false
    }

    if (!validOrders.includes(sort.orderBy)) {
      return false
    }

    return true
  }

  /**
   * Validate tag IDs
   *
   * @param {{
   *   tagIds: Array<number>
   * }} params
   * @returns {boolean}
   */
  isTagIdsValid ({
    tagIds,
  }) {
    return Array.isArray(tagIds)
      && tagIds.every(tagId => Number.isInteger(tagId) && tagId > 0)
  }

  /**
   * Count total number of articles based on filters
   *
   * @param {{
   *   tagIds: Array<number>
   * }} params
   * @returns {Promise<number>}
   */
  async countArticles ({
    tagIds,
  }) {
    const articleIdSubquery = ArticleTag.subquery(
      '?TagIds.ArticleId',
      {
        TagIds: tagIds,
      }
    )

    return Article.count({
      where: {
        id: {
          [Op.in]: articleIdSubquery,
        },
      },
    })
  }

  /**
   * Find articles based on filters and pagination
   *
   * @param {{
   *   tagIds: Array<number>,
   *   pagination: {
   *     limit: number,
   *     offset: number,
   *     sort?: {
   *       targetColumn: string,
   *       orderBy: string
   *     }
   *   }
   * }} params
   * @returns {Promise<Array<AssociatedArticleEntty>>}
   */
  async findArticles ({
    tagIds,
    pagination: {
      limit,
      offset,
      sort = {
        targetColumn: 'postedAt',
        orderBy: 'DESC',
      },
    },
  }) {
    const articleIdSubquery = ArticleTag.subquery(
      '?TagIds.ArticleId',
      {
        TagIds: tagIds,
      }
    )

    return Article.findAll({
      where: {
        id: {
          [Op.in]: articleIdSubquery,
        },
      },
      include: [
        ArticleThumbnail,
        {
          model: ArticleTag,
          include: [Tag],
        },
      ],
      order: [
        [sort.targetColumn, sort.orderBy],
      ],
      limit,
      offset,
    })
  }

  /**
   * Format the response
   *
   * @param {{
   *   articles: Array<AssociatedArticleEntty>,
   *   pagination: {
   *     limit: number,
   *     offset: number,
   *     sort: {
   *       targetColumn: string,
   *       orderBy: string,
   *     },
   *     totalRecords: number,
   *   }
   * }} params
   * @returns {graphqlAdmin.ArticlesResult}
   */
  formatResponse ({
    articles,
    pagination: {
      limit,
      offset,
      sort,
      totalRecords,
    },
  }) {
    return {
      articles: articles.map(article => ({
        articleId: article.id,
        thumbnailUrl: article.ArticleThumbnail.imageUrl,
        title: article.title,
        postedAt: article.postedAt,
        savedAt: article.savedAt,
        tags: article.ArticleTags.map(articleTag => ({
          tagId: articleTag.Tag.id,
          name: articleTag.Tag.name,
        })),
      })),
      pagination: {
        limit,
        offset,
        sort,
        totalRecords,
      },
    }
  }

  /** @inheritdoc */
  get schema () {
    return 'articles'
  }
}

/**
 * @typedef {model.Article & {
 *   ArticleThumbnail: model.ArticleThumbnail
 *   ArticleTags: Array<model.ArticleTag & {
 *     Tag: model.Tag
 *   }>
 * }} AssociatedArticleEntty
 */
