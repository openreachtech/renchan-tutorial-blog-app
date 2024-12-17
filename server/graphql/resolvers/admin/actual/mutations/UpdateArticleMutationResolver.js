import {
  BaseMutationResolver,
} from '@openreachtech/renchan'
import Article from '../../../../../../sequelize/models/Article.js'
import ArticleTag from '../../../../../../sequelize/models/ArticleTag.js'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail.js'
import ArticleStatusLatest from '../../../../../../sequelize/models/ArticleLatestStatus.js'
import Tag from '../../../../../../sequelize/models/Tag.js'
import NewArticleValidator from '../../../../../../app/globals/validator/NewArticleValidator.js'

import constants from '../../../../../../app/globals/constants.js'

const {
  ARTICLE_STATUS_RESOLVER,
} = constants

export default class UpdateArticleMutationResolver extends BaseMutationResolver {
  /**
   * constructor
   *
   * @param {UpdateArticleMutationResolverParams} params
   */
  constructor ({
    articleStatusResolver,
    ...restArgs
  }) {
    super(restArgs)

    this.articleStatusResolver = articleStatusResolver
  }

  /**
   * Factory method
   *
   * @param {UpdateArticleMutationResolverFactoryParams} params
   * @returns {UpdateArticleMutationResolver}
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
      InvalidInput: '203.M003.001',
      ArticleNotFound: '204.M003.002',
      InvalidThumbnailUrl: '203.M003.003',
      InvalidTitle: '203.M003.004',
      InvalidContent: '203.M003.005',
      InvalidPostedAt: '203.M003.006',
      InvalidTagIds: '203.M003.007',
      InvalidStatusId: '203.M003.008',
    }
  }

  /**
   * resolve
   *
   * @param {{
   *   input: server.graphql.admin.UpdateArticleInput
   * }} params
   * @returns {Promise<server.graphql.admin.UpdateArticleResult>}
   */
  async resolve ({
    input: {
      articleId,
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

    const article = await this.findArticle({
      articleId,
    })

    if (!article) {
      throw this.errorHash.ArticleNotFound.create()
    }

    const tags = await this.findTags({
      tagIds,
    })

    if (tagIds.length > tags.length) {
      throw this.errorHash.TagsNotFound.create()
    }

    this.setArticleParams({
      article,
      thumbnailUrl,
      title,
      content,
      postedAt,
      tagIds,
      statusId,
    })

    const callback = this.generateTransactionCallback({
      article,
      tags,
    })

    const savedArticle = await Article.beginTransaction(callback)

    return this.formatResponse({
      tags,
      savedArticle,
    })
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
   * Find article by id with associations
   *
   * @param {{
   *   articleId: number
   * }} params
   * @returns {Promise<AssociatedArticle|null>}
   */
  async findArticle ({
    articleId,
  }) {
    return /** @type {*} */ (Article.findByPk(
      articleId,
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
    return /** @type {*} */ (Tag.findAll({
      where: {
        id: tagIds,
      },
    }))
  }

  /**
   * Update article entities
   *
   * @param {{
   *   article: AssociatedArticle
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
  setArticleParams ({
    article,
    thumbnailUrl,
    title,
    content,
    postedAt,
    tagIds,
    statusId,
    savedAt = this.now,
  }) {
    article.set({
      title,
      content,
      postedAt: new Date(postedAt),
      savedAt,
    })

    article.ArticleThumbnail.set({
      imageUrl: thumbnailUrl,
      savedAt,
    })

    article.ArticleLatestStatus.set({
      ArticleStatusId: statusId,
      savedAt,
    })

    return article
  }

  /**
   * generate transaction callback
   *
   * @param {{
   *   article: AssociatedArticle
   *   tags: Array<model.Tag>
   *   savedAt?: Date
   * }} param0
   * @returns {function(import('sequelize').Transaction): Promise<AssociatedArticle>}
   */
  generateTransactionCallback ({
    article,
    tags,
    savedAt = this.now
  }) {
    return async transaction => {
      // 記事本体とその関連エンティティを保存
      await article.save({ transaction })

      // ArticleThumbnailの保存
      await article.ArticleThumbnail.save({ transaction })

      // ArticleLatestStatusの保存
      await article.ArticleLatestStatus.save({ transaction })

      // タグの関連付けを更新（トランザクション内で実行）
      await article.setTags(
        tags,
        {
          through: {
            savedAt,
          },
          transaction,
        }
      )

      return article
    }
  }

  /**
   * Format response
   *
   * @param {{
   *   tags: Array<model.Tag>
   *   savedArticle: AssociatedArticle
   * }} params
   * @returns {server.graphql.admin.UpdateArticleResult}
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
      }),
      status: {
        statusId: savedArticle.ArticleLatestStatus.ArticleStatusId,
        statusName: this.articleStatusResolver[savedArticle.ArticleLatestStatus.ArticleStatusId].NAME,
        phasedAt: savedArticle.ArticleLatestStatus.savedAt,
      },
    }
  }

  /**
   * Format tags
   *
   * @param {{
   *   tags: Array<model.Tag>
   * }} params
   * @returns {Array<{
   *   tagId: number
   *   name: string
   * }>}
   */
  formatTags ({
    tags,
  }) {
    return tags.map(tag => ({
      tagId: tag.id,
      name: tag.name,
    }))
  }

  /** @inheritdoc */
  get schema () {
    return 'updateArticle'
  }
}

/**
 * @typedef {{
 *   articleStatusResolver: object
 * }} UpdateArticleMutationResolverParams
 */
/**
 * @typedef {{
 *   articleStatusResolver?: object
 * }} UpdateArticleMutationResolverFactoryParams
 */

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
