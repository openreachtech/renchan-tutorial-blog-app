'use strict'

import Admin from '../models/Admin'

const MigrationAttributeFactory = require('@openreachtech/renchan-sequelize/lib/tools/MigrationAttributeFactory.cjs')

const TABLE_NAME = 'admin_usernames'
const COLUMN_NAME = {
  ADMIN_ID: 'admin_id',
  USERNAME: 'username',
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

      AdminId: {
        type: Sequelize.BIGINT,
        field: COLUMN_NAME.ADMIN_ID,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(191),
        field: COLUMN_NAME.USERNAME,
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
        [COLUMN_NAME.ADMIN_ID],
        {
          name: [
            TABLE_NAME,
            COLUMN_NAME.ADMIN_ID,
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
