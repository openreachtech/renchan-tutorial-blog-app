import {
  BaseGraphqlShare,
} from '@openreachtech/renchan'

/**
 * Extra client.
 *
 * @note This is a dummy class.
 * When implementing actual code,
 * please refer to this ExtraClient in this sample code.
 */
const ExtraClient = class {
  /**
   * Factory method.
   *
   * @param {*} params - Parameters of this factory method.
   * @returns {ExtraClient} - Instance of this constructor.
   */
  static create ({
    config,
  }) {
    return new this()
  }
}

/**
 * GraphQL shared object for Customer.
 */
export default class CustomerGraphqlShare extends BaseGraphqlShare {
  /**
   * Constructor.
   *
   * @param {CustomerGraphqlShareParams} params - Parameters of this constructor.
   */
  constructor ({
    extraClient,
    ...restArgs
  }) {
    super(restArgs)

    this.extraClient = extraClient
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof CustomerGraphqlShare ? X : never} T, X
   * @param {CustomerGraphqlShareFactoryParams} params - Parameters of this factory method.
   * @returns {InstanceType<T>} - Instance of this constructor.
   * @this {T}
   */
  static create ({
    extraClient,
    ...restArgs
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        extraClient,
        ...restArgs,
      })
    )
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof CustomerGraphqlShare ? X : never} T, X
   * @param {CustomerGraphqlShareAsyncFactoryParams} params - Parameters of this factory method.
   * @returns {Promise<InstanceType<T>>} - Instance of this constructor.
   * @this {T}
   */
  static async createAsync ({
    config,
  }) {
    const extraClient = ExtraClient.create({
      config,
    })

    const broker = this.createBroker({
      config,
    })

    return this.create({
      env: this.generateEnv(),
      broker,
      extraClient,
    })
  }
}

/**
 * @typedef {import('../../../../lib/server/graphql/contexts/BaseGraphqlShare.js').BaseGraphqlShareParams & {
 *   extraClient: ExtraClient
 * }} CustomerGraphqlShareParams
 */

/**
 * @typedef {CustomerGraphqlShareParams} CustomerGraphqlShareFactoryParams
 */

/**
 * @typedef {import('../../../../lib/server/graphql/contexts/BaseGraphqlShare.js').BaseGraphqlShareAsyncFactoryParams} CustomerGraphqlShareAsyncFactoryParams
 */
