import {
  BaseSubscriptionResolver,
} from '@openreachtech/renchan'

/**
 * OnReceiveMessage subscription graphql resolver.
 *
 * @extends {BaseSubscriptionResolver<OnReceiveMessageSubscribeVariables, OnReceiveMessageSubscribeResponse>}
 */
export default class OnReceiveMessageSubscriptionResolver extends BaseSubscriptionResolver {
  /** @override */
  static get schema () {
    return 'onReceiveMessage'
  }

  /**
   * Generate channel query.
   *
   * @override
   * @param {{
   *   variables: OnReceiveMessageSubscribeVariables
   * }} params - Parameters.
   * @returns {Record<string, string | number>} - Channel query.
   * @throws {Error} - this function must be inherited
   */
  generateChannelQuery ({
    variables: {
      input: {
        roomId,
      },
    },
  }) {
    return {
      roomId,
    }
  }
}

/**
 * @typedef {{
 *   input: {
 *     roomId: number
 *   }
 * }} OnReceiveMessageSubscribeVariables
 */

/**
 * @typedef {{
 *   onReceiveMessage: {
 *     message: {
 *       id: number
 *       content: string
 *       sender: string
 *     }
 *   }
 * }} OnReceiveMessageSubscribeResponse
 */
