import {
  RenchanModel,
  ModelAttributeFactory,
} from '@openreachtech/renchan-sequelize'

import {
  RandomTextGenerator,
} from '@openreachtech/renchan-tools'

/**
 * AdminAccessToken model.
 */
export default class AdminAccessToken extends RenchanModel {
  /** @override */
  static createAttributes (DataTypes) {
    const factory = ModelAttributeFactory.create(DataTypes)

    return {
      ...factory.ID_BIGINT,

      // ForeignKey must start with upper case.
      AdminId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }
  }

  /** @override */
  static createOptions (sequelizeClient) {
    return {
      ...super.createOptions(sequelizeClient),
    }
  }

  /** @override */
  static associate () {
    super.associate?.()

    this.belongsTo(this._.Admin)
  }

  /** @override */
  static defineScopes (Op) {
    super.defineScopes?.(Op)

    // noop
  }

  /** @override */
  static setupHooks () {
    super.setupHooks?.()

    // noop
  }

  /** @override */
  static defineSubqueries () {
    super.defineSubqueries?.()

    // noop
  }

  /**
   * Build with generated attributes.
   *
   * @param {{
   *   adminId: number
   *   generatedAt: Date
   *   expiredAt?: Date
   *   token?: string
   * }} params - Parameters.
   * @returns {model.AdminAccessToken}
   */
  static buildWithGeneratedAttributes ({
    adminId,
    generatedAt,
    expiredAt = this.createExpiredAt({
      generatedAt,
    }),
    token = this.generateAccessToken(),
  }) {
    return this.build({
      AdminId: adminId,
      generatedAt,
      expiredAt,
      token,
    })
  }

  /**
   * Create expired at.
   *
   * @param {{
   *   generatedAt: Date
   * }} params - Parameters.
   * @returns {Date} - Expired at.
   */
  static createExpiredAt ({
    generatedAt,
  }) {
    const oneDayMilliseconds = 60 * 60 * 24 * 1000 // milliseconds in a day

    const expiredAt = new Date(
      generatedAt.getTime()
      + oneDayMilliseconds
    )

    return expiredAt
  }

  /**
   * Generate access token.
   *
   * @param {{
   *   length?: number
   * }} [params] - Parameters.
   * @returns {string} - Access token.
   */
  static generateAccessToken ({
    length = 10,
  } = {}) {
    const generator = RandomTextGenerator.create()

    return generator.generate(length)
  }
}

/**
 * @typedef {model.AdminAccessToken & {
 *   Admin: model.Admin
 * }} AdminAccessTokenAssociatedEntity
 */
