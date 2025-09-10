import '../../../../../../sequelize/_.js'

import ArticleQueryResolver from '../../../../../../server/graphql/resolvers/admin/actual/queries/ArticleQueryResolver.js'

describe('ArticleQueryResolver', () => {
  describe('#resolve', () => {
    const resolver = ArticleQueryResolver.create()
    const mockContext = {}

    describe('when article is successfully resolved', () => {
      const successCases = [
        {
          name: 'Breaking News Article',
          input: {
            articleId: 50001,
          },
          expected: {
            articleId: 50001,
            thumbnailUrl: '/images/breaking-news-50001.jpg',
            title: 'Breaking News Article',
            content: `# Major Discovery in Tech Industry

A breakthrough in quantum computing has been announced today. Scientists have achieved stable quantum entanglement at room temperature.

## Key Points
- 99.9% success rate
- Room temperature operation
- Commercial applications expected`,
            postedAt: new Date('2024-04-01T10:00:00Z'),
            savedAt: new Date('2024-04-01T10:00:00Z'),
            tags: [
              {
                tagId: 50001,
                name: 'news',
              },
              {
                tagId: 50002,
                name: 'technology',
              },
            ],
          },
        },
        {
          name: 'Tech Review',
          input: {
            articleId: 50002,
          },
          expected: {
            articleId: 50002,
            thumbnailUrl: '/images/tech-review-50002.jpg',
            title: 'Tech Review',
            content: `# NextGen Pro Review

Quick review of the latest smartphone.

## Specs
- 6.7" display
- 12GB RAM
- 256GB storage

**Verdict**: 4/5 stars`,
            postedAt: new Date('2024-04-02T11:30:00Z'),
            savedAt: new Date('2024-04-02T11:30:00Z'),
            tags: [
              {
                tagId: 50002,
                name: 'technology',
              },
            ],
          },
        },
      ]

      test.each(successCases)('should resolve $name successfully', async ({
        input,
        expected,
      }) => {
        const result = await resolver.resolve(
          {
            input,
          },
          mockContext
        )

        expect(result)
          .toEqual(expected)
      })
    })

    describe('when article ID is invalid', () => {
      const invalidIdCases = [
        {
          name: 'string',
          input: {
            articleId: 'invalid',
          },
        },
        {
          name: 'float',
          input: {
            articleId: 1.5,
          },
        },
        {
          name: 'zero',
          input: {
            articleId: 0,
          },
        },
        {
          name: 'negative',
          input: {
            articleId: -1,
          },
        },
        {
          name: 'null',
          input: {
            articleId: null,
          },
        },
        {
          name: 'undefined',
          input: {
            articleId: undefined,
          },
        },
      ]

      test.each(invalidIdCases)('should throw error for $name article ID', async ({
        input,
      }) => {
        await expect(resolver.resolve(
          {
            input,
          },
          mockContext
        ))
          .rejects
          .toThrow('203.Q002.002')
      })
    })

    describe('when article is not found', () => {
      const notFoundCases = [
        {
          name: 'non-existent ID',
          input: {
            articleId: 99999,
          },
        },
      ]

      test.each(notFoundCases)('should throw error for $name', async ({
        input,
      }) => {
        await expect(resolver.resolve(
          {
            input,
          },
          mockContext
        ))
          .rejects
          .toThrow('204.Q002.001')
      })
    })
  })

  describe('#isArticleIdValid', () => {
    const resolver = ArticleQueryResolver.create()

    describe('when article ID is valid', () => {
      const validCases = [
        {
          name: 'positive integer',
          articleId: 1,
          expected: true,
        },
        {
          name: 'large positive integer',
          articleId: 999999,
          expected: true,
        },
      ]

      test.each(validCases)('should return true for $name', ({
        articleId,
        expected,
      }) => {
        const result = resolver.isArticleIdValid({
          articleId,
        })

        expect(result)
          .toBe(expected)
      })
    })

    describe('when article ID is invalid', () => {
      const invalidCases = [
        {
          name: 'zero',
          articleId: 0,
          expected: false,
        },
        {
          name: 'negative integer',
          articleId: -1,
          expected: false,
        },
        {
          name: 'float',
          articleId: 1.5,
          expected: false,
        },
        {
          name: 'string',
          articleId: '1',
          expected: false,
        },
        {
          name: 'null',
          articleId: null,
          expected: false,
        },
        {
          name: 'undefined',
          articleId: undefined,
          expected: false,
        },
        {
          name: 'object',
          articleId: {},
          expected: false,
        },
        {
          name: 'array',
          articleId: [],
          expected: false,
        },
      ]

      test.each(invalidCases)('should return false for $name', ({
        articleId,
        expected,
      }) => {
        const result = resolver.isArticleIdValid({
          articleId,
        })

        expect(result)
          .toBe(expected)
      })
    })
  })

  describe('#findArticle', () => {
    const resolver = ArticleQueryResolver.create()

    describe('when article exists', () => {
      const existingArticleCases = [
        {
          name: 'Breaking News Article',
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
            postedAt: new Date('2024-04-01T10:00:00Z'),
            savedAt: new Date('2024-04-01T10:00:00Z'),
            ArticleThumbnail: {
              imageUrl: '/images/breaking-news-50001.jpg',
            },
            ArticleTags: [
              {
                Tag: {
                  id: 50001,
                  name: 'news',
                },
              },
              {
                Tag: {
                  id: 50002,
                  name: 'technology',
                },
              },
            ],
          },
        },
      ]

      test.each(existingArticleCases)('should find $name with all associations', async ({
        articleId,
        expected,
      }) => {
        const result = await resolver.findArticle({
          articleId,
        })

        expect(result)
          .toMatchObject(expected)
      })
    })

    describe('when article does not exist', () => {
      const nonExistentCases = [
        {
          name: 'non-existent ID',
          articleId: 99999,
        },
      ]

      test.each(nonExistentCases)('should return null for $name', async ({
        articleId,
      }) => {
        const result = await resolver.findArticle({
          articleId,
        })

        expect(result)
          .toBeNull()
      })
    })
  })

  describe('#formatResponse', () => {
    const resolver = ArticleQueryResolver.create()

    describe('when formatting article response', () => {
      const cases = [
        {
          name: 'should format article with all fields',
          article: {
            id: 50001,
            title: 'Breaking News Article',
            content: '# Major Discovery in Tech Industry',
            postedAt: new Date('2024-04-01T10:00:00Z'),
            savedAt: new Date('2024-04-01T10:00:00Z'),
            ArticleThumbnail: {
              imageUrl: '/images/breaking-news-50001.jpg',
            },
            ArticleTags: [
              {
                Tag: {
                  id: 50001,
                  name: 'news',
                },
              },
              {
                Tag: {
                  id: 50002,
                  name: 'technology',
                },
              },
            ],
          },
          expected: {
            articleId: 50001,
            thumbnailUrl: '/images/breaking-news-50001.jpg',
            title: 'Breaking News Article',
            content: '# Major Discovery in Tech Industry',
            postedAt: new Date('2024-04-01T10:00:00Z'),
            savedAt: new Date('2024-04-01T10:00:00Z'),
            tags: [
              {
                tagId: 50001,
                name: 'news',
              },
              {
                tagId: 50002,
                name: 'technology',
              },
            ],
          },
        },
      ]

      test.each(cases)('$name', ({
        article,
        expected,
      }) => {
        const result = resolver.formatResponse({
          article,
        })

        expect(result)
          .toEqual(expected)
      })
    })
  })

  describe('#schema', () => {
    test('should return correct schema name', () => {
      const resolver = ArticleQueryResolver.create()

      expect(resolver.schema)
        .toBe('article')
    })
  })
})
