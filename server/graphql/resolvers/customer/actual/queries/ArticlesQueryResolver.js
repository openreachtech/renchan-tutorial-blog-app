import {
  Op,
} from 'sequelize'
import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

import Article from '../../../../../../sequelize/models/Article'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail'
import ArticleTag from '../../../../../../sequelize/models/ArticleTag'
import Tag from '../../../../../../sequelize/models/Tag'

export default class ArticlesQueryResolver extends BaseQueryResolver {
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

  /**
   * Resolve articles query
   *
   * @param {{
   *   input: server.graphql.customer.ArticlesInput
   * }} params
   * @returns {Promise<server.graphql.customer.ArticlesResult>}
   */
  async resolve ({
    input: {
      tagIds,
      pagination,
    },
  }) {
    if (!this.isInputValid({
      tagIds,
      pagination,
    })) {
      throw this.errorHash.InvalidInput.create()
    }

    const articles = await this.findArticles({
      tagIds,
      pagination,
    })

    if (!articles.length) {
      throw this.errorHash.ArticlesNotFound.create()
    }

    const totalRecords = await this.countArticles({
      tagIds,
    })

    return this.formatResponse({
      articles,
      pagination,
      totalRecords,
    })
  }

  /**
   * Validate input parameters
   *
   * @param {{
   *   tagIds: Array<number>,
   *   pagination: server.graphql.customer.PaginationInput
   * }} params
   * @returns {boolean}
   */
  isInputValid ({
    tagIds,
    pagination: {
      limit,
      offset,
      sort,
    },
  }) {
    return this.isTagIdsValid({ tagIds })
      && this.isPaginationValid({
        limit,
        offset,
        sort,
      })
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
      && tagIds.every(id => Number.isInteger(id) && id > 0)
  }

  /**
   * Validate pagination parameters
   *
   * @param {{
   *   limit: number,
   *   offset: number,
   *   sort?: {
   *     targetColumn: string,
   *     orderBy: string
   *   }
   * }} params
   * @returns {boolean}
   */
  isPaginationValid ({
    limit,
    offset,
    sort = {
      targetColumn: 'postedAt',
      orderBy: 'DESC',
    },
  }) {
    const validColumns = ['postedAt', 'title']
    const validOrders = ['ASC', 'DESC']

    return Number.isInteger(limit)
      && limit > 0
      && Number.isInteger(offset)
      && offset >= 0
      && validColumns.includes(sort.targetColumn)
      && validOrders.includes(sort.orderBy)
  }

  /**
   * Find articles based on tag IDs and pagination
   *
   * @param {{
   *   tagIds: Array<number>,
   *   pagination: server.graphql.customer.PaginationInput
   * }} params
   * @returns {Promise<Array<model.ArticleWithAssociationsEntity>>}
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
      include: [
        ArticleThumbnail,
        {
          model: ArticleTag,
          include: [Tag],
        },
      ],
      where: {
        id: {
          [Op.in]: articleIdSubquery,
        },
      },
      order: [
        [sort.targetColumn, sort.orderBy],
      ],
      limit,
      offset,
    })
  }

  /**
   * Count total number of articles for given tags
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
   * Format response data
   *
   * @param {{
   *   articles: Array<model.ArticleWithAssociationsEntity>,
   *   pagination: server.graphql.customer.PaginationInput,
   *   totalRecords: number
   * }} params
   * @returns {server.graphql.customer.ArticlesResult}
   */
  formatResponse ({
    articles,
    pagination,
    totalRecords,
  }) {
    return {
      articles: articles.map(article => ({
        articleId: article.id,
        thumbnailUrl: article.ArticleThumbnail.imageUrl,
        title: article.title,
        postedAt: article.postedAt,
        tags: article.ArticleTags
          .sort((tagBefore, tagAfter) => tagBefore.Tag.name.localeCompare(tagAfter.Tag.name, 'ja'))
          .map(articleTag => ({
            tagId: articleTag.Tag.id,
            name: articleTag.Tag.name,
          })),
      })),
      pagination: {
        ...pagination,
        totalRecords,
      },
    }
  }

  /** @inheritdoc */
  get schema () {
    return 'articles'
  }
}
