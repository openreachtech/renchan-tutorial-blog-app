/**
 * @fileoverview Validator for AddNewArticleInput
 */

import constants from '../constants'

const {
  MAX_ARTICLE_TITLE_LENGTH,
  MINIMUM_ARTICLE_TITLE_LENGTH,
} = constants

export default class NewArticleValidator {
  /**
   * Constructor
   *
   * @param {NewArticleValidatorParams} params
   */
  constructor ({
    articleParams,
  }) {
    this.articleParams = articleParams
  }

  /**
   * Create instance
   *
   * @param {NewArticleValidatorParams} params
   * @returns {NewArticleValidator}
   */
  static create ({
    articleParams,
  }) {
    return new this({
      articleParams,
    })
  }

  /**
   * Is thumbnail URL valid?
   *
   * @param {{
   *   thumbnailUrl?: string
   * }} param
   * @returns {boolean}
   */
  isThumbnailUrlValid ({
    thumbnailUrl = this.articleParams.thumbnailUrl,
  } = {}) {
    return Boolean(thumbnailUrl)
      && /^https?:\/\/.+/u.test(thumbnailUrl)
  }

  /**
   * Is title valid?
   *
   * @param {{
   *   title?: string
   * }} param
   * @returns {boolean}
   */
  isTitleValid ({
    title = this.articleParams.title,
  } = {}) {
    return Boolean(title)
      && title.trim().length > MINIMUM_ARTICLE_TITLE_LENGTH
      && title.length <= MAX_ARTICLE_TITLE_LENGTH
  }

  /**
   * Is content valid?
   *
   * @param {{
   *   content?: string
   * }} param
   * @returns {boolean}
   */
  isContentValid ({
    content = this.articleParams.content,
  } = {}) {
    return Boolean(content)
      && content.trim().length > 0
  }

  /**
   * Is posted at valid?
   *
   * @param {{
   *   postedAt?: Date
   * }} param
   * @returns {boolean}
   */
  isPostedAtValid ({
    postedAt = this.articleParams.postedAt,
  } = {}) {
    const date = new Date(postedAt)

    return Boolean(postedAt)
      && date instanceof Date
      && !isNaN(date.getTime())
  }

  /**
   * Is tag IDs valid?
   *
   * @param {{
   *   tagIds?: Array<number>
   * }} param
   * @returns {boolean}
   */
  isTagIdsValid ({
    tagIds = this.articleParams.tagIds,
  } = {}) {
    return Array.isArray(tagIds)
      && tagIds.every(tagId =>
        Number.isInteger(tagId)
        && tagId > 0
      )
  }

  /**
   * Is status ID valid?
   *
   * @param {{
   *   statusId?: number
   * }} param
   * @returns {boolean}
   */
  isStatusIdValid ({
    statusId = this.articleParams.statusId,
  } = {}) {
    return Number.isInteger(statusId)
      && statusId > 0
  }

  /**
   * Is all article params valid?
   *
   * @param {{
   *   thumbnailUrl: string
   *   title: string
   *   content: string
   *   postedAt: string
   *   tagIds: number[]
   *   statusId: number
   * }} params
   * @returns {boolean}
   */
  isArticleParamsValid ({
    thumbnailUrl,
    title,
    content,
    postedAt,
    tagIds,
    statusId,
  } = this.articleParams) {
    const isValidThumbnailUrl = this.isThumbnailUrlValid({
      thumbnailUrl,
    })
    const isValidTitle = this.isTitleValid({
      title,
    })
    const isValidContent = this.isContentValid({
      content,
    })
    const isValidPostedAt = this.isPostedAtValid({
      postedAt,
    })
    const isValidTagIds = this.isTagIdsValid({
      tagIds,
    })
    const isValidStatusId = this.isStatusIdValid({
      statusId,
    })

    return isValidThumbnailUrl
      && isValidTitle
      && isValidContent
      && isValidPostedAt
      && isValidTagIds
      && isValidStatusId
  }
}

/**
 * @typedef {{
 *   thumbnailUrl: string
 *   title: string
 *   content: string
 *   postedAt: Date
 *   tagIds: Array<number>
 *   statusId: number
 * }} articleParams
 */

/**
 * @typedef {{
 *   articleParams: articleParams
 * }} NewArticleValidatorParams
 */
