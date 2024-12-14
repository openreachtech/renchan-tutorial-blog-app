import '../../../../../../sequelize/_.js'

import Article from '../../../../../../sequelize/models/Article.js'
import ArticleThumbnail from '../../../../../../sequelize/models/ArticleThumbnail.js'
import ArticleTag from '../../../../../../sequelize/models/ArticleTag.js'
import Tag from '../../../../../../sequelize/models/Tag.js'
import ArticleQueryResolver from '../../../../../../server/graphql/resolvers/customer/actual/queries/ArticleQueryResolver.js'

describe('ArticleQueryResolver', () => {
  describe('#resolve', () => {
    const resolver = ArticleQueryResolver.create()

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
          name: 'Featured Story',
          input: {
            articleId: 50006,
          },
          expected: {
            articleId: 50006,
            thumbnailUrl: '/images/featured-story-50006.jpg',
            title: 'Featured Story',
            content: `# Green Technology

Exploring sustainable tech innovations.

## Sectors
- Solar power
- Electric vehicles
- Smart grids

> "Innovation meets sustainability"`,
            postedAt: new Date('2024-04-03T15:45:00Z'),
            tags: [
              {
                tagId: 50001,
                name: 'news',
              },
              {
                tagId: 50006,
                name: 'feature',
              },
            ],
          },
        },
      ]

      test.each(successCases)('should resolve $name successfully', async ({
        input,
        expected,
      }) => {
        const result = await resolver.resolve({
          input,
        })

        expect(result)
          .toEqual(expected)
      })
    })

    describe('when article ID is invalid', () => {
      const invalidIdCases = [
        { name: 'string', input: { articleId: 'invalid' } },
        { name: 'float', input: { articleId: 1.5 } },
        { name: 'zero', input: { articleId: 0 } },
        { name: 'negative', input: { articleId: -1 } },
        { name: 'null', input: { articleId: null } },
        { name: 'undefined', input: { articleId: undefined } },
        { name: 'object', input: { articleId: {} } },
      ]

      test.each(invalidIdCases)('should throw InvalidArticleId error for $name', async ({
        input,
      }) => {
        await expect(resolver.resolve({
          input,
        }))
          .rejects
          .toThrow('203.Q001.003')
      })
    })

    describe('when article is not found', () => {
      const notFoundCases = [
        { name: 'non-existent ID', input: { articleId: 99999 } },
      ]

      test.each(notFoundCases)('should throw ArticleNotFound error for $name', async ({
        input,
      }) => {
        await expect(resolver.resolve({
          input,
        }))
          .rejects
          .toThrow('204.Q001.001')
      })
    })
  })

  describe('#isArticleIdValid', () => {
    describe('when article ID is valid', () => {
      const validCases = [
        { name: 'positive integer', articleId: 1 },
        { name: 'large positive integer', articleId: 1000000 },
      ]

      test.each(validCases)('should return true for $name', ({
        articleId,
      }) => {
        const resolver = ArticleQueryResolver.create()

        expect(resolver.isArticleIdValid({
          articleId,
        }))
          .toBeTruthy()
      })
    })

    describe('when article ID is invalid', () => {
      const invalidCases = [
        { name: 'zero', articleId: 0 },
        { name: 'negative integer', articleId: -1 },
        { name: 'float', articleId: 1.5 },
        { name: 'string', articleId: '1' },
        { name: 'null', articleId: null },
        { name: 'undefined', articleId: undefined },
        { name: 'boolean', articleId: true },
        { name: 'object', articleId: {} },
        { name: 'array', articleId: [] },
        { name: 'NaN', articleId: NaN },
        { name: 'Infinity', articleId: Infinity },
        { name: '-Infinity', articleId: -Infinity },
      ]

      test.each(invalidCases)('should return false for $name', ({
        articleId,
      }) => {
        const resolver = ArticleQueryResolver.create()

        expect(resolver.isArticleIdValid({
          articleId,
        }))
          .toBeFalsy()
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
        {
          name: 'Featured Story',
          articleId: 50006,
          expected: {
            id: 50006,
            title: 'Featured Story',
            content: `# Green Technology

Exploring sustainable tech innovations.

## Sectors
- Solar power
- Electric vehicles
- Smart grids

> "Innovation meets sustainability"`,
            postedAt: new Date('2024-04-03T15:45:00Z'),
            ArticleThumbnail: {
              imageUrl: '/images/featured-story-50006.jpg',
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
                  id: 50006,
                  name: 'feature',
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
      const nonExistentArticleCases = [
        {
          name: 'non-existent article',
          articleId: 99999,
        },
      ]

      test.each(nonExistentArticleCases)('should return null for $name', async ({
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
    const cases = [
      {
        name: 'should format article response correctly',
        params: {
          article: Article.build({
            id: 50001,
            title: 'Breaking News Article',
            content: `# Major Discovery in Tech Industry

A breakthrough in quantum computing has been announced today. Scientists have achieved stable quantum entanglement at room temperature.

## Key Points
- 99.9% success rate
- Room temperature operation
- Commercial applications expected`,
            postedAt: new Date('2024-04-01T10:00:00Z'),
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
          }, {
            include: [
              ArticleThumbnail,
              {
                model: ArticleTag,
                include: [Tag],
              },
            ],
          }),
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
      params,
      expected,
    }) => {
      const resolver = ArticleQueryResolver.create()
      const result = resolver.formatResponse(params)

      expect(result)
        .toEqual(expected)
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
