import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

import Admin from '../../../../../../sequelize/models/Admin'
import AdminUsername from '../../../../../../sequelize/models/AdminUsername'
import AdminSecret from '../../../../../../sequelize/models/AdminSecret'

export default class AdminsQueryResolver extends BaseQueryResolver {
  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // DB Related Errors
      AdminNotFound: '204.Q001.001',

      // Validation Errors
      InvalidPaginationInput: '203.Q001.002',
      InvalidLimitValue: '203.Q001.003',
      InvalidOffsetValue: '203.Q001.004',
      InvalidSortColumn: '203.Q001.005',
      InvalidSortOrder: '203.Q001.006',

      // Calculation Errors
      CannotCalculatePagination: '201.Q001.007',
    }
  }

  /**
   * Resolve the admins query
   *
   * @param {{
   *   input: {
   *     pagination: graphqlAdmin.PaginationInput
   *   }
   * }} params
   * @param {renchanMiddleware.AdminContext} context
   * @returns {Promise<graphqlAdmin.AdminsResult>}
   */
  async resolve (
    {
      input: {
        pagination,
      },
    },
    context
  ) {
    if (!this.isPaginationValid(pagination)) {
      throw this.errorHash.InvalidPaginationInput.create()
    }

    const admins = await this.findAdmins({
      pagination,
    })

    const totalRecords = await this.countAdmins()

    return this.formatResponse({
      admins,
      pagination,
      totalRecords,
    })
  }

  /**
   * Validate pagination input
   *
   * @param {graphqlAdmin.PaginationInput} pagination
   * @returns {boolean}
   */
  isPaginationValid ({
    limit,
    offset,
    sort = {
      targetColumn: 'registeredAt',
      orderBy: 'DESC',
    },
  }) {
    if (!Number.isInteger(limit) || limit <= 0) {
      return false
    }

    if (!Number.isInteger(offset) || offset < 0) {
      return false
    }

    if (!['registeredAt'].includes(sort.targetColumn)) {
      return false
    }

    if (!['ASC', 'DESC'].includes(sort.orderBy)) {
      return false
    }

    return true
  }

  /**
   * Find admins based on pagination
   *
   * @param {{
   *   pagination: graphqlAdmin.PaginationInput
   * }} params
   * @returns {Promise<Array<AdminEntity>>}
   */
  async findAdmins ({
    pagination: {
      limit,
      offset,
      sort = {
        targetColumn: 'registeredAt',
        orderBy: 'DESC',
      },
    },
  }) {
    return Admin.findAll({
      include: [
        AdminUsername,
        AdminSecret,
      ],
      order: [
        [sort.targetColumn, sort.orderBy],
      ],
      limit,
      offset,
    })
  }

  /**
   * Count total number of admins
   *
   * @returns {Promise<number>}
   */
  async countAdmins () {
    return Admin.count()
  }

  /**
   * Format the response
   *
   * @param {{
   *   admins: Array<AdminEntity>,
   *   pagination: graphqlAdmin.PaginationInput,
   *   totalRecords: number
   * }} params
   * @returns {graphqlAdmin.AdminsResult}
   */
  formatResponse ({
    admins,
    pagination,
    totalRecords,
  }) {
    return {
      admins: admins.map(admin => ({
        adminId: admin.id,
        username: admin.AdminUsername.username,
        email: admin.AdminSecret.email,
        registeredAt: admin.registeredAt,
      })),
      pagination: {
        ...pagination,
        totalRecords,
      },
    }
  }

  /** @inheritdoc */
  get schema () {
    return 'admins'
  }
}

/**
 * @typedef {model.Admin & {
 *   AdminUsername: model.AdminUsername,
 *   AdminSecret: model.AdminSecret,
 * }} AdminEntity
 */
