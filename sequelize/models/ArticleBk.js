import {
  RenchanModel,
  ModelAttributeFactory,
} from '@openreachtech/renchan-sequelize'

/**
 * ArticleBk model
 *
 * @class ArticleBk
 * @extends {RenchanModel}
 */
export default class ArticleBk extends RenchanModel {
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
      tableName: 'articles_bk',
    }
  }

  /**
   * Define model associations
   */
  static associate () {
    super.associate?.()

    // noop
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
}
