import {
  setTimeout,
} from 'timers/promises'

import BigNumber from 'bignumber.js'

import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class CustomerAmountsQueryResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'customerAmounts'
  }

  /** @override */
  async resolve ({
    context,
  }) {
    await setTimeout(200)

    return {
      stakedAmount: new BigNumber('789000000.123456678012345'),
      rewardsAmount: new BigNumber('123.987654321098765'),
    }
  }
}

/**
 * @typedef {{
 *   id: number
 *   title: string
 *   description: string
 *   thumbnailUrl: string
 *   postedAt: string
 * }} CurriculumEntity
 */

/**
 * @typedef {{
 *   limit: number
 *   offset: number
 *   sort: {
 *     targetColumn: string
 *     orderBy: string
 *   }
 * }} paginationType
 */
