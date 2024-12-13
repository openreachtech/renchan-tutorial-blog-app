import {
  RenchanModel,
  ModelAttributeFactory,
  BackupMixinModel,
} from '@openreachtech/renchan-sequelize'

/**
 * ArticleLatestStatus model
 *
 * @class ArticleLatestStatus
 * @extends {RenchanModel}
 */
export default class ArticleLatestStatus extends RenchanModel {
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
      ArticleStatusId: {
        type: DataTypes.INTEGER,
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
    this.belongsTo(this._.ArticleStatus)
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

    const attributes = this.getAttributes()
    const ArticleIdField = attributes.ArticleId.field
    const ArticleStatusIdField = attributes.ArticleStatusId.field

    this.addSubquery({
      name: '?ArtileStatusId.ArticleId',
      generator: ({
        ArtileStatusId,
      }) => {
        const attributes = [
          ArticleIdField,
        ]

        const whereClause = {
          [ArticleStatusIdField]: ArtileStatusId,
        }

        return {
          attributes,
          where: whereClause,
        }
      },
    })
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
   * @returns {typeof import('./ArticleStatusPhase')} Backup model declaration
   */
  static get BackupModel () {
    return this._.ArticleStatusPhase
  }
}
