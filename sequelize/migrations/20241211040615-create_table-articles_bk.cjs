'use strict'

const MigrationAttributeFactory = require('@openreachtech/renchan-sequelize/lib/tools/MigrationAttributeFactory.cjs')

const TABLE_NAME = 'articles_bk'
const COLUMN_NAME = {
  TITLE: 'title',
  CONTENT: 'content',
  POSTED_AT: 'posted_at',
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

      title: {
        type: Sequelize.STRING(191),
        field: COLUMN_NAME.TITLE,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        field: COLUMN_NAME.CONTENT,
        allowNull: false,
      },
      postedAt: {
        type: Sequelize.DATE(3),
        field: COLUMN_NAME.POSTED_AT,
        allowNull: false,
      },
      savedAt: {
        type: Sequelize.DATE(3),
        field: COLUMN_NAME.SAVED_AT,
        allowNull: false,
      },

      ...factory.TIMESTAMPS,
    })
  },

  async down (
    queryInterface,
    Sequelize
  ) {
    return queryInterface.dropTable(TABLE_NAME)
  },
}
