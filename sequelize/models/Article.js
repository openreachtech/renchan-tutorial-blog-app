import {
  RenchanModel,
  ModelAttributeFactory,
  BackupMixinModel,
} from '@openreachtech/renchan-sequelize'

/**
 * Article model
 *
 * @class Article
 * @extends {RenchanModel}
 */
export default class Article extends RenchanModel {
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

      title: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postedAt: {
        type: DataTypes.DATE(3),
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

    this.hasOne(this._.ArticleThumbnail)
    this.hasMany(this._.ArticleTag)
    this.hasOne(this._.ArticleLatestStatus)
    this.hasMany(this._.ArticleStatusPhase)
    this.belongsToMany(this._.Tag, {
      through: this._.ArticleTag,
    })
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
   * @returns {typeof import('./ArticleBk')} Backup model declaration
   */
  static get BackupModel () {
    return this._.ArticleBk
  }
}
