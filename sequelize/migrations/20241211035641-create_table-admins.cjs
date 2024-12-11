'use strict'

const MigrationAttributeFactory = require('@openreachtech/renchan-sequelize/lib/tools/MigrationAttributeFactory.cjs')

const TABLE_NAME = 'admins'
const COLUMN_NAME = {
  REGISTERED_AT: 'registered_at',
}

module.exports = {
  async up (
    queryInterface,
    Sequelize
  ) {
    const factory = MigrationAttributeFactory.create(Sequelize)

    return queryInterface.createTable(TABLE_NAME, {
      ...factory.ID_BIGINT,

      registeredAt: {
        type: Sequelize.DATE(3),
        field: COLUMN_NAME.REGISTERED_AT,
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
