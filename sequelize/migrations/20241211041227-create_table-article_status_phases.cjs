'use strict'

const MigrationAttributeFactory = require('@openreachtech/renchan-sequelize/lib/tools/MigrationAttributeFactory.cjs')

const TABLE_NAME = 'article_status_phases'
const COLUMN_NAME = {
  ARTICLE_ID: 'article_id',
  ARTICLE_STATUS_ID: 'article_status_id',
  SAVED_AT: 'saved_at',
}

module.exports = {
  async up (
    queryInterface,
    Sequelize
  ) {
    const factory = MigrationAttributeFactory.create(Sequelize)

    return queryInterface.createTable(TABLE_NAME, {
      ...factory.ID_BIGINT,

      ArticleId: {
        type: Sequelize.BIGINT,
        field: COLUMN_NAME.ARTICLE_ID,
        allowNull: false,
      },
      ArticleStatusId: {
        type: Sequelize.INTEGER,
        field: COLUMN_NAME.ARTICLE_STATUS_ID,
        allowNull: false,
      },
      savedAt: {
        type: Sequelize.DATE(3),
        field: COLUMN_NAME.SAVED_AT,
        allowNull: false,
      },

      ...factory.TIMESTAMPS,
    })
      .then(() => queryInterface.addIndex(
        TABLE_NAME,
        [
          COLUMN_NAME.ARTICLE_ID,
        ],
        {
          name: [
            TABLE_NAME,
            COLUMN_NAME.ARTICLE_ID,
            'index',
          ].join('_'),
        }
      ))
      .then(() => queryInterface.addIndex(
        TABLE_NAME,
        [
          COLUMN_NAME.ARTICLE_STATUS_ID,
        ],
        {
          name: [
            TABLE_NAME,
            COLUMN_NAME.ARTICLE_STATUS_ID,
            'index',
          ].join('_'),
        }
      ))
  },

  async down (
    queryInterface,
    Sequelize
  ) {
    return queryInterface.dropTable(TABLE_NAME)
  },
}
