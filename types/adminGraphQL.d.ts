export {}

declare global {
  namespace graphqlAdmin {
    // Scalar types
    type DateTime = Date
    type Upload = File

    // Query type
    interface Query {
      admins(input: AdminsInput): AdminsResult
      articles(input: ArticlesInput): ArticlesResult
      article(input: ArticleInput): Article
      articleStatuses: ArtcleStatusesResult
    }

    // Mutation type
    interface Mutation {
      addNewArticle(input: AddNewArticleInput): AddNewArticleResult
      signIn(input: SignInInput): SignInResult
      updateArticle(input: UpdateArticleInput): UpdateArticleResult
      uploadThumbnail(input: UploadThumbnailInput): UploadThumbnailResult
    }

    // Query result types
    interface AdminsResult {
      admins: Array<ListAdmin>
      pagination: Pagination
    }

    interface AddNewArticleResult {
      articleId: number
      thumbnailUrl: string
      title: string
      content: string
      postedAt: string
      savedAt: string
      tags: Array<Tag>
      status: StatusPhase
    }

    interface ArticlesResult {
      articles: Array<ListArticle>
      pagination: Pagination
    }

    interface ArticleStatusesResult {
      statuses: Array<Status>
    }

    interface Article {
      articleId: number
      thumbnailUrl: string
      title: string
      content: string
      postedAt: DateTime
      savedAt: DateTime
      tags: Array<Tag>
    }

    interface ListAdmin {
      adminId: number
      username: string
      email: string
      registeredAt: DateTime
    }

    interface ListArticle {
      articleId: number
      thumbnailUrl: string
      title: string
      postedAt: DateTime
      savedAt: DateTime
      tags: Array<Tag>
    }

    interface Pagination {
      limit: number
      offset: number
      sort?: Sort
      totalRecords: number
    }

    interface SignInResult {
      accessToken: string
    }

    interface Sort {
      targetColumn: string
      orderBy: string
    }

    interface Status {
      statusId: number
      name: string
    }

    interface StatusPhase {
      statusId: number
      statusName: string
      phasedAt: DateTime
    }

    interface Tag {
      tagId: number
      name: string
    }

    interface UpdateArticleResult {
      articleId: number
      thumbnailUrl: string
      title: string
      content: string
      postedAt: DateTime
      savedAt: DateTime
      tags: Array<Tag>
      status: StatusPhase
    }

    interface UploadThumbnailResult {
      imageUrl: string
    }

    // Input types
    interface AddNewArticleInput {
      thumbnailUrl: string
      title: string
      content: string
      postedAt: DateTime
      tagIds?: Array<number>
      statusId: number
    }

    interface AdminsInput {
      pagination: PaginationInput
    }

    interface ArticleInput {
      articleId: number
    }

    interface ArticlesInput {
      tagIds: Array<number>
      pagination: PaginationInput
    }

    interface PaginationInput {
      limit: number
      offset: number
      sort?: SortInput
    }

    interface SortInput {
      targetColumn: string
      orderBy: string
    }

    interface SignInInput {
      email: string
      password: string
    }

    interface UpdateArticleInput {
      articleId: number
      thumbnailUrl: string
      title: string
      content: string
      postedAt: DateTime
      tagIds?: Array<number>
      statusId: number
    }

    interface UploadThumbnailInput {
      image: Upload
    }
  }
}
