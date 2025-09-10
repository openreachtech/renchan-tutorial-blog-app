export {}

declare global {
  namespace model {
    // 管理者関連
    interface Admin {
      id: number
      registeredAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface AdminAccessToken {
      id: number
      AdminId: number
      token: string
      generatedAt: Date
      expiredAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface AdminUsername {
      id: number
      AdminId: number
      username: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface AdminUsernameBk {
      id: number
      AdminId: number
      username: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface AdminSecret {
      id: number
      AdminId: number
      email: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface AdminSecretBk {
      id: number
      AdminId: number
      email: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface AdminPasswordHash {
      id: number
      AdminId: number
      passwordHash: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface AdminPasswordHashBk {
      id: number
      AdminId: number
      passwordHash: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    // 記事関連
    interface Article {
      id: number
      title: string
      content: string
      postedAt: Date
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface ArticleBk {
      id: number
      title: string
      content: string
      postedAt: Date
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface ArticleThumbnail {
      id: number
      ArticleId: number
      imageUrl: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface ArticleThumbnailBk {
      id: number
      ArticleId: number
      imageUrl: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface ArticleTag {
      id: number
      ArticleId: number
      TagId: number
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface ArticleStatus {
      id: number
      name: string
      description: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface ArticleLatestStatus {
      id: number
      ArticleId: number
      ArticleStatusId: number
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface ArticleStatusPhase {
      id: number
      ArticleId: number
      ArticleStatusId: number
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    interface Tag {
      id: number
      name: string
      savedAt: Date
      createdAt: Date
      updatedAt: Date
    }

    // Association Entities
    interface AdminWithAssociationsEntity extends Admin {
      AdminAccessTokens?: Array<AdminAccessToken>
      AdminSecret?: AdminSecret
      AdminSecretBk?: AdminSecretBk
      AdminUsername?: AdminUsername
      AdminUsernameBk?: AdminUsernameBk
      AdminPasswordHash?: AdminPasswordHash
      AdminPasswordHashBk?: AdminPasswordHashBk
    }

    interface ArticleWithAssociationsEntity extends Article {
      ArticleThumbnail?: ArticleThumbnail
      ArticleThumbnailBk?: ArticleThumbnailBk
      ArticleTags?: Array<ArticleTagWithAssociationsEntity>
      ArticleLatestStatus?: ArticleLatestStatusWithAssociationsEntity
      ArticleStatusPhases?: Array<ArticleStatusPhase>
    }

    interface ArticleTagWithAssociationsEntity extends ArticleTag {
      Article?: ArticleWithAssociationsEntity
      Tag?: Tag
    }

    interface ArticleLatestStatusWithAssociationsEntity extends ArticleLatestStatus {
      Article?: ArticleWithAssociationsEntity
      ArticleStatus?: ArticleStatus
    }
  }
}
