import '../../../../../../sequelize/_.js'

import Article from '../../../../../../sequelize/models/Article.js'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail.js'
import ArticleStatusLatest from '../../../../../../sequelize/models/ArticleLatestStatus.js'
import UpdateArticleMutationResolver from '../../../../../../server/graphql/resolvers/admin/actual/mutations/UpdateArticleMutationResolver.js'

describe('UpdateArticleMutationResolver', () => {
  describe('#findArticle()', () => {
    describe('when article exists', () => {
      const existingCases = [
        {
          name: 'finds article with all associations',
          articleId: 50001,
          expected: {
            id: 50001,
            title: 'Breaking News Article',
            content: `# Major Discovery in Tech Industry

A breakthrough in quantum computing has been announced today. Scientists have achieved stable quantum entanglement at room temperature.

## Key Points
- 99.9% success rate
- Room temperature operation
- Commercial applications expected`,
            ArticleTags: [
              {
                ArticleId: 50001,
              },
              {
                ArticleId: 50001,
              },
            ],
            ArticleThumbnail: {
              ArticleId: 50001,
              imageUrl: '/images/breaking-news-50001.jpg',
            },
            ArticleLatestStatus: {
              ArticleId: 50001,
              ArticleStatusId: 50001,
            },
          },
        },
      ]

      test.each(existingCases)('$name', async ({
        articleId,
        expected,
      }) => {
        const resolver = UpdateArticleMutationResolver.create()
        const result = await resolver.findArticle({
          articleId,
        })

        expect(result.id)
          .toBe(expected.id)
        expect(result.title)
          .toBe(expected.title)
        expect(result.ArticleTags)
          .toHaveLength(expected.ArticleTags.length)
        expect(result.ArticleThumbnail.imageUrl)
          .toBe(expected.ArticleThumbnail.imageUrl)
        expect(result.ArticleLatestStatus.ArticleStatusId)
          .toBe(expected.ArticleLatestStatus.ArticleStatusId)
      })
    })

    describe('when article does not exist', () => {
      const nonExistentCases = [
        {
          name: 'returns null for non-existent article',
          articleId: 99999,
        },
      ]

      test.each(nonExistentCases)('$name', async ({
        articleId,
      }) => {
        const resolver = UpdateArticleMutationResolver.create()
        const result = await resolver.findArticle({
          articleId,
        })

        expect(result)
          .toBeNull()
      })
    })
  })

  describe('#findTags()', () => {
    describe('when tags exist', () => {
      const existingTagsCases = [
        {
          name: 'finds multiple existing tags',
          tagIds: [50001, 50002],
          expected: [
            { id: 50001, name: 'news' },
            { id: 50002, name: 'technology' },
          ],
        },
      ]

      test.each(existingTagsCases)('$name', async ({
        tagIds,
        expected,
      }) => {
        const resolver = UpdateArticleMutationResolver.create()
        const result = await resolver.findTags({
          tagIds,
        })

        expect(result)
          .toEqual(expect.arrayContaining(
            expected.map(tag => expect.objectContaining(tag))
          ))
      })
    })
  })

  describe('#setArticleParams()', () => {
    const mockNow = new Date('2024-04-10T00:00:00Z')

    const setParamsCases = [
      {
        name: 'sets all article parameters correctly',
        params: {
          article: Article.build(
            {
              id: 50001,
              title: 'Original Title',
              content: 'Original content',
              postedAt: new Date('2024-04-01T00:00:00Z'),
              savedAt: new Date('2024-04-01T00:00:00Z'),
              ArticleThumbnail: {
                imageUrl: '/images/original.jpg',
              },
              ArticleLatestStatus: {
                ArticleStatusId: 50001,
              },
            },
            {
              include: [
                ArticleThumbnail,
                ArticleStatusLatest,
              ],
            }
          ),
          thumbnailUrl: '/images/updated.jpg',
          title: 'Updated Title',
          content: 'Updated content',
          postedAt: '2024-04-10T00:00:00Z',
          tagIds: [50001, 50002],
          statusId: 50002,
          savedAt: mockNow,
        },
        expected: {
          title: 'Updated Title',
          content: 'Updated content',
          postedAt: new Date('2024-04-10T00:00:00Z'),
          savedAt: mockNow,
          ArticleThumbnail: {
            imageUrl: '/images/updated.jpg',
            savedAt: mockNow,
          },
          ArticleLatestStatus: {
            ArticleStatusId: 50002,
            savedAt: mockNow,
          },
        },
      },
    ]

    test.each(setParamsCases)('$name', ({
      params,
      expected,
    }) => {
      const resolver = UpdateArticleMutationResolver.create()
      const result = resolver.setArticleParams(params)

      expect(result)
        .toMatchObject(expected)
    })
  })

  describe('#schema', () => {
    test('returns correct schema name', () => {
      const resolver = UpdateArticleMutationResolver.create()

      expect(resolver.schema)
        .toBe('updateArticle')
    })
  })
})
