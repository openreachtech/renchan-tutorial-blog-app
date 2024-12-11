'use strict'

const MigrationAttributeFactory = require('@openreachtech/renchan-sequelize/lib/tools/MigrationAttributeFactory.cjs')

const TABLE_NAME = 'article_statuses'
const COLUMN_NAME = {
  NAME: 'name',
  DESCRIPTION: 'description',
  SAVED_AT: 'saved_at',
}

module.exports = {
  async up (
    queryInterface,
    Sequelize
  ) {
    const factory = MigrationAttributeFactory.create(Sequelize)

    return queryInterface.createTable(TABLE_NAME, {
      ...factory.ID_INTEGER,

      name: {
        type: Sequelize.STRING(191),
        field: COLUMN_NAME.NAME,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(191),
        field: COLUMN_NAME.DESCRIPTION,
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
          COLUMN_NAME.NAME,
        ],
        {
          name: [
            TABLE_NAME,
            COLUMN_NAME.NAME,
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
