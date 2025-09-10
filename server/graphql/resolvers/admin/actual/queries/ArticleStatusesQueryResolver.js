import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

import ArticleStatus from '../../../../../../sequelize/models/ArticleStatus.js'

export default class ArticleStatusesQueryResolver extends BaseQueryResolver {
  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // DB Related Errors
      StatusesNotFound: '204.Q004.001',

      // Validation Errors
      InvalidStatusId: '203.Q004.002',
    }
  }

  /**
   * Resolve article statuses query
   *
   * @param {object} params
   * @param {server.graphql.context.AdminContext} context
   * @returns {Promise<server.graphql.admin.ArticleStatusesResult>}
   */
  async resolve (
    params,
    context
  ) {
    const statuses = await this.findStatuses()

    if (!statuses || statuses.length === 0) {
      throw this.errorHash.StatusesNotFound.create()
    }

    return this.formatResponse({
      statuses,
    })
  }

  /**
   * Find all article statuses
   *
   * @returns {Promise<Array<model.ArticleStatus>>}
   */
  async findStatuses () {
    return ArticleStatus.findAll({
      order: [
        ['id', 'ASC'],
      ],
    })
  }

  /**
   * Format the response
   *
   * @param {{
   *   statuses: Array<model.ArticleStatus>
   * }} params
   * @returns {server.graphql.admin.ArticleStatusesResult}
   */
  formatResponse ({
    statuses,
  }) {
    return {
      statuses: statuses.map(status => ({
        statusId: status.id,
        name: status.name,
      })),
    }
  }

  /** @inheritdoc */
  get schema () {
    return 'articleStatuses'
  }
}
