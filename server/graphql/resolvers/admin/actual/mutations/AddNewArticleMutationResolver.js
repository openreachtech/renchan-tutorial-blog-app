import {
  BaseMutationResolver,
} from '@openreachtech/renchan'

import Article from '../../../../../../sequelize/models/Article.js'
import ArticleTag from '../../../../../../sequelize/models/ArticleTag.js'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail.js'
import ArticleStatusLatest from '../../../../../../sequelize/models/ArticleLatestStatus.js'
import NewArticleValidator from '../../../../../../app/globals/validator/NewArticleValidator.js'
import Tag from '../../../../../../sequelize/models/Tag.js'

import constants from '../../../../../../app/globals/constants.js'

const {
  ARTICLE_STATUS_RESOLVER,
} = constants

export default class AddNewArticleMutationResolver extends BaseMutationResolver {
  /**
   * constructor
   *
   * @param {*} params
   */
  constructor ({
    articleStatusResolver,
    ...restArgs
  }) {
    super({
      ...restArgs,
    })

    this.articleStatusResolver = articleStatusResolver
  }

  /**
   * Factory method.
   *
   * @param {*} params
   * @returns {AddNewArticleMutationResolver}
   */
  static create ({
    articleStatusResolver = ARTICLE_STATUS_RESOLVER,
  } = {}) {
    const errorHash = this.buildErrorHash({
      errorCodeHash: this.errorCodeHash,
    })

    return new this({
      articleStatusResolver,
      errorHash,
    })
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // Validation Errors
      InvalidInput: '203.M001.001',
      InvalidThumbnailUrl: '203.M001.002',
      InvalidTitle: '203.M001.003',
      InvalidContent: '203.M001.004',
      InvalidPostedAt: '203.M001.005',
      InvalidTagIds: '203.M001.006',
      InvalidStatusId: '203.M001.007',

      // DB Related Errors
      ArticleCreationFailed: '204.M001.008',
      TagsNotFound: '204.M001.009',
      StatusNotFound: '204.M001.010',
    }
  }

  /**
   * resolve
   *
   * @param {{
   *   input: server.graphql.admin.AddNewArticleInput
   * }} params
   * @returns {Promise<server.graphql.admin.AddNewArticleResult>}
   */
  async resolve ({
    input: {
      thumbnailUrl,
      title,
      content,
      postedAt,
      tagIds,
      statusId,
    },
  }) {
    const validator = this.generateNewArticleValidator({
      articleParams: {
        thumbnailUrl,
        title,
        content,
        postedAt,
        tagIds,
        statusId,
      },
    })

    if (!validator.isArticleParamsValid()) {
      throw this.errorHash.InvalidInput.create()
    }

    const tags = await this.findTags({
      tagIds,
    })

    if (tagIds.length > tags.length) {
      throw this.errorHash.TagsNotFound.create()
    }

    const article = this.buildArticle({
      thumbnailUrl,
      title,
      content,
      tagIds,
      statusId,
      postedAt,
    })

    const callback = this.generateTransactionCallback({
      article,
    })

    const savedArticle = await Article.beginTransaction(callback)

    return this.formatResponse({
      tags,
      savedArticle,
    })
  }

  /**
   * Find tags by tagIds
   *
   * @param {{
   *   tagIds: Array<number>
   * }} params
   * @returns {Promise<Array<model.Tag>>}
   */
  async findTags ({
    tagIds,
  }) {
    return /** @type {*} */(Tag.findAll({
      where: {
        id: tagIds,
      },
    }))
  }

  /**
   * Generate NewArticleValidator instance
   *
   * @param {{
   *   articleParams: import('../../../../../../app/globals/validator/NewArticleValidator.js').articleParams
   * }} params
   * @returns {NewArticleValidator}
   */
  generateNewArticleValidator ({
    articleParams,
  }) {
    return NewArticleValidator.create({
      articleParams,
    })
  }

  /**
   * Format tags
   *
   * @param {{
   *   tags: Array<model.Tag>
   *   savedTags: Array<model.ArticleTag>
   * }} params
   * @returns {Array<{
   *   tagId: number
   *   name: string
   * }>}
   */
  formatTags ({
    tags,
    savedTags,
  }) {
    return savedTags.map(articleTag => ({
      tagId: articleTag.TagId,
      name: tags.find(tag => tag.id === articleTag.TagId).name,
    }))
  }

  /**
   * Build Article entity
   *
   * @param {{
   *   thumbnailUrl: string
   *   title: string
   *   content: string
   *   postedAt: Date
   *   tagIds: Array<number>
   *   statusId: number
   *   savedAt?: Date
   * }} params
   * @returns {AssociatedArticle}
   */
  buildArticle ({
    thumbnailUrl,
    title,
    content,
    postedAt,
    tagIds,
    statusId,
    savedAt = this.now,
  }) {
    return /** @type {*} */ (Article.build(
      {
        thumbnailUrl,
        title,
        content,
        postedAt: new Date(postedAt),
        savedAt,
        ArticleThumbnail: {
          imageUrl: thumbnailUrl,
          savedAt,
        },
        ArticleTags: tagIds.map(tagId => ({
          TagId: tagId,
          savedAt,
        })),
        ArticleLatestStatus: {
          ArticleStatusId: statusId,
          savedAt,
        },
      },
      {
        include: [
          ArticleTag,
          ArticleThumbnail,
          ArticleStatusLatest,
        ],
      }
    ))
  }

  /**
   * Generate transaction callback
   *
   * @param {{
   *   article: AssociatedArticle
   * }} params
   * @returns {(transaction?: import('sequelize').Transaction) => Promise<model.Article>}
   */
  generateTransactionCallback ({
    article,
  }) {
    /**
     * Save entities under transaction
     *
     * @param {import('sequelize').Transaction} transaction
     * @returns {Promise<AssociatedArticle>}
     */
    return async transaction => article.save({ transaction })
  }

  /**
   * Format response
   *
   * @param {{
   *   tags: Array<model.Tag>
   *   savedArticle: AssociatedArticle
   * }} params
   * @returns {server.graphql.admin.AddNewArticleResult}
   */
  formatResponse ({
    tags,
    savedArticle,
  }) {
    return {
      articleId: savedArticle.id,
      thumbnailUrl: savedArticle.ArticleThumbnail.imageUrl,
      title: savedArticle.title,
      content: savedArticle.content,
      postedAt: savedArticle.postedAt,
      savedAt: savedArticle.savedAt,
      tags: this.formatTags({
        tags,
        savedTags: savedArticle.ArticleTags,
      }),
      status: {
        statusId: savedArticle.ArticleLatestStatus.ArticleStatusId,
        statusName: this.articleStatusResolver[savedArticle.ArticleLatestStatus.ArticleStatusId].NAME,
        phasedAt: savedArticle.ArticleLatestStatus.savedAt,
      },
    }
  }

  /** @inheritdoc */
  get schema () {
    return 'addNewArticle'
  }
}

/**
 * @typedef {model.Article & import('@openreachtech/renchan-sequelize').RenchanModel & {
 *   ArticleTags: Array<model.ArticleTag & {
 *     Tag: model.Tag
 *   }>
 *   ArticleLatestStatus: model.ArticleLatestStatus & {
 *     ArticleStatus: model.ArticleStatus
 *   }
 *   ArticleThumbnail: model.ArticleThumbnail
 * }} AssociatedArticle
 */
