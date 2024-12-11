import {
  RenchanModel,
  ModelAttributeFactory,
  BackupMixinModel,
} from '@openreachtech/renchan-sequelize'

/**
 * ArticleThumbnail model
 *
 * @class ArticleThumbnail
 * @extends {RenchanModel}
 */
export default class ArticleThumbnail extends RenchanModel {
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

      ArticleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.TEXT,
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

    this.belongsTo(this._.Article)
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
   * @returns {typeof import('./ArticleThumbnailBk')} Backup model declaration
   */
  static get BackupModel () {
    return this._.ArticleThumbnailBk
  }
}
