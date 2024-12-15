import {
  RenchanModel,
  ModelAttributeFactory,
  BackupMixinModel,
} from '@openreachtech/renchan-sequelize'
import {
  Encipher,
} from '@openreachtech/renchan-tools'

/**
 * AdminPasswordHash model
 *
 * @class AdminPasswordHash
 * @extends {RenchanModel}
 */
export default class AdminPasswordHash extends RenchanModel {
  /**
   * Define model attributes
   *
   * @param {import('sequelize').DataTypes} DataTypes - Sequelize DataTypes
   * @returns {object} Model attributes
   */
  static createAttributes (DataTypes) {
    const factory = ModelAttributeFactory.create(DataTypes)

    return {
      ...factory.ID_BIGINT,

      AdminId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      savedAt: {
        type: DataTypes.DATE(3),
        allowNull: false,
      },
    }
  }

  /**
   * Define model options
   *
   * @param {import('sequelize').Sequelize} sequelizeClient - Sequelize instance
   * @returns {object} Model options
   */
  static createOptions (sequelizeClient) {
    return {
      ...super.createOptions(sequelizeClient),
    }
  }

  /**
   * Define model associations
   */
  static associate () {
    super.associate?.()

    this.belongsTo(this._.Admin)
  }

  /**
   * Define model scopes
   *
   * @param {import('sequelize').Op} Op - Sequelize operator
   */
  static defineScopes (Op) {
    super.defineScopes?.(Op)

    // noop
  }

  /**
   * Setup hooks
   */
  static setupHooks () {
    super.setupHooks?.()
    // noop
  }

  /**
   * Define subqueries
   */
  static defineSubqueries () {
    super.defineSubqueries?.()
    // noop
  }

  /**
   * Get model mixins
   *
   * @returns {Array} Array of mixins
   */
  static get Mixins () {
    return [
      BackupMixinModel,
    ]
  }

  /**
   * Get backup model for BackupMixinModel
   *
   * @returns {typeof import('./AdminPasswordHashBk')} Backup model declaration
   */
  static get BackupModel () {
    return this._.AdminPasswordHashBk
  }

  /**
   * Verifies password.
   *
   * @param {{
   *   password: string
   * }} params - Parameters.
   * @returns {Promise<boolean>}
   */
  async verifyPassword ({
    password,
  }) {
    /** @type {string} */
    const passwordHash = /** @type {*} */ (
      this.get('passwordHash')
    )

    if (!passwordHash) {
      return false
    }

    const encipher = Encipher.create()

    return encipher.compare(
      password,
      passwordHash
    )
  }
}
