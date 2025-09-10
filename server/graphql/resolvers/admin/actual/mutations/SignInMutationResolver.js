import {
  BaseMutationResolver,
} from '@openreachtech/renchan'

import Admin from '../../../../../../sequelize/models/Admin.js'
import AdminPasswordHash from '../../../../../../sequelize/models/AdminPasswordHash.js'
import AdminSecret from '../../../../../../sequelize/models/AdminSecret.js'
import AdminAccessToken from '../../../../../../sequelize/models/AdminAccessToken.js'

export default class SignInMutationResolver extends BaseMutationResolver {
  /** @override */
  static get schema () {
    return 'signIn'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      IncorrectSecret: '202.M002.001',
    }
  }

  /** @override */
  async resolve ({
    variables: {
      input: {
        email,
        password,
      },
    },
    context,
  }) {
    const passwordHashEntity = await this.findPasswordHashByEmail({
      email,
    })

    if (!passwordHashEntity) {
      throw this.errorHash.IncorrectSecret.create()
    }

    const isValidPassword = await passwordHashEntity.verifyPassword({
      password,
    })

    if (!isValidPassword) {
      throw this.errorHash.IncorrectSecret.create()
    }

    const accessTokenEntity = await this.saveAccessToken({
      context,
      adminId: passwordHashEntity.AdminId,
    })

    return this.formatResponse({
      accessTokenEntity,
    })
  }

  /**
   * Find password customer by email.
   *
   * @param {{
   *   email: string
   * }} params
   * @returns {Promise<AdminPasswordHashEntity | null>}
   */
  async findPasswordHashByEmail ({
    email,
  }) {
    /**
     * @type {AdminSecret & {
     *   Admin: Admin & {
     *     AdminPasswordHash: AdminPasswordHash
     *   }
     * } | null}
     */
    const customerSecretEntity = /** @type {*} */ (
      await AdminSecret.findOne({
        where: {
          email,
        },
        include: [
          {
            model: Admin,
            include: [
              AdminPasswordHash,
            ],
          },
        ],
      })
    )

    if (!customerSecretEntity) {
      return null
    }

    const {
      Admin: {
        AdminPasswordHash: passwordHashEntity,
      },
    } = customerSecretEntity

    return /** @type {*} */ (passwordHashEntity)
  }

  /**
   * Save access token.
   *
   * @param {{
   *   context: import('../../../../contexts/AdminGraphqlContext.js').default
   *   adminId: number
   * }} params - Parameters.
   * @returns {Promise<model.AdminAccessToken>}
   * @throws {Error} - Throws error if transaction fails.
   */
  async saveAccessToken ({
    context,
    adminId,
  }) {
    const callback = this.generateTransactionCallback({
      adminId,
      now: context.now,
    })

    return AdminAccessToken.beginTransaction(callback)
  }

  /**
   * Generate transaction callback.
   *
   * @param {{
   *   adminId: number
   *   now,
   * }} params
   * @returns {function(): Promise<model.AdminAccessToken>}
   */
  generateTransactionCallback ({
    adminId,
    now,
  }) {
    const accessTokenEntity = AdminAccessToken.buildWithGeneratedAttributes({
      generatedAt: now,
      adminId,
    })

    return async transaction => /** @type {*} */ (
      accessTokenEntity.save({
        transaction,
      })
    )
  }

  /**
   * Format response.
   *
   * @param {{
   *   accessTokenEntity: model.AdminAccessToken
   * }} params - Parameters.
   * @returns {{
   *   accessToken: string
   * }}
   */
  formatResponse ({
    accessTokenEntity: {
      token,
    },
  }) {
    return {
      accessToken: token,
    }
  }
}

/**
 * @typedef {import('../../../../../../sequelize/models/AdminPasswordHash').default & model.AdminPasswordHash} AdminPasswordHashEntity
 */
