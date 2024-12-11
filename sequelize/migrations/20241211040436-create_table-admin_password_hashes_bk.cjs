'use strict'

const MigrationAttributeFactory = require('@openreachtech/renchan-sequelize/lib/tools/MigrationAttributeFactory.cjs')

const TABLE_NAME = 'admin_password_hashes_bk'
const COLUMN_NAME = {
  PASSWORD_HASH: 'password_hash',
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

      passwordHash: {
        type: Sequelize.STRING(191),
        field: COLUMN_NAME.PASSWORD_HASH,
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
