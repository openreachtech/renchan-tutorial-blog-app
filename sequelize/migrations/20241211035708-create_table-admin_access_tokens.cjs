'use strict'

const MigrationAttributeFactory = require('@openreachtech/renchan-sequelize/lib/tools/MigrationAttributeFactory.cjs')

const TABLE_NAME = 'admin_access_tokens'
const COLUMN_NAME = {
  ADMIN_ID: 'admin_id',
  TOKEN: 'token',
  GENERATED_AT: 'generated_at',
  EXPIRED_AT: 'expired_at',
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
      token: {
        type: Sequelize.STRING(191),
        field: COLUMN_NAME.TOKEN,
        allowNull: false,
      },
      generatedAt: {
        type: Sequelize.DATE(3),
        field: COLUMN_NAME.GENERATED_AT,
        allowNull: false,
      },
      expiredAt: {
        type: Sequelize.DATE(3),
        field: COLUMN_NAME.EXPIRED_AT,
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
      .then(() => queryInterface.addIndex(
        TABLE_NAME,
        [COLUMN_NAME.TOKEN],
        {
          name: [
            TABLE_NAME,
            COLUMN_NAME.TOKEN,
            'index',
          ].join('_'),
        }
      ))
      .then(() => queryInterface.addIndex(
        TABLE_NAME,
        [COLUMN_NAME.GENERATED_AT],
        {
          name: [
            TABLE_NAME,
            COLUMN_NAME.GENERATED_AT,
            'index',
          ].join('_'),
        }
      ))
      .then(() => queryInterface.addIndex(
        TABLE_NAME,
        [COLUMN_NAME.EXPIRED_AT],
        {
          name: [
            TABLE_NAME,
            COLUMN_NAME.EXPIRED_AT,
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
