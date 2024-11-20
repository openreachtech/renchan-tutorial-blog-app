import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

import ChatRoom from '../../../../../../sequelize/models/ChatRoom.js'

export default class ChatRoomsQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'chatRooms'
  }

  /** @override */
  async resolve ({
    context,
  }) {
    /**
     * @type {Array<import('../../../../../../sequelize/models/ChatRoom').ChatRoomEntity>}
     */
    const chatRoomEntries = /** @type {Array<*>} */ (
      await ChatRoom.findAll()
    )

    const rooms = chatRoomEntries
      .map(({
        id,
        name,
      }) => ({
        id,
        name,
      }))

    rooms.sort((alpha, beta) =>
      alpha.name.localeCompare(beta.name)
    )

    return {
      rooms,
    }
  }
}
