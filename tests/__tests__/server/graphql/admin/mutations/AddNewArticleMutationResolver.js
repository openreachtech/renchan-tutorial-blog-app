import '../../../../../../sequelize/_.js'

import AddNewArticleMutationResolver from '../../../../../../server/graphql/resolvers/admin/actual/mutations/AddNewArticleMutationResolver.js'

describe('AddNewArticleMutationResolver', () => {
  describe('#findTags', () => {
    const resolver = AddNewArticleMutationResolver.create()

    describe('when tags exist', () => {
      const existingTagsCases = [
        {
          name: 'finds multiple tags',
          tagIds: [50001, 50002],
          expected: [
            { id: 50001, name: 'news' },
            { id: 50002, name: 'technology' },
          ],
        },
        {
          name: 'finds single tag',
          tagIds: [50001],
          expected: [
            { id: 50001, name: 'news' },
          ],
        },
      ]

      test.each(existingTagsCases)('$name', async ({
        tagIds,
        expected,
      }) => {
        const result = await resolver.findTags({
          tagIds,
        })

        expect(result)
          .toMatchObject(expected)
      })
    })

    describe('when tags do not exist', () => {
      const nonExistingTagsCases = [
        {
          name: 'returns empty array for non-existent tags',
          tagIds: [99999],
        },
      ]

      test.each(nonExistingTagsCases)('$name', async ({
        tagIds,
      }) => {
        const result = await resolver.findTags({
          tagIds,
        })

        expect(result)
          .toHaveLength(0)
      })
    })
  })

  describe('#formatTags', () => {
    const resolver = AddNewArticleMutationResolver.create()

    const formattingCases = [
      {
        name: 'formats multiple tags correctly',
        tags: [
          { id: 50001, name: 'news' },
          { id: 50002, name: 'technology' },
        ],
        savedTags: [
          { TagId: 50001 },
          { TagId: 50002 },
        ],
        expected: [
          { tagId: 50001, name: 'news' },
          { tagId: 50002, name: 'technology' },
        ],
      },
      {
        name: 'formats single tag correctly',
        tags: [
          { id: 50001, name: 'news' },
        ],
        savedTags: [
          { TagId: 50001 },
        ],
        expected: [
          { tagId: 50001, name: 'news' },
        ],
      },
    ]

    test.each(formattingCases)('$name', ({
      tags,
      savedTags,
      expected,
    }) => {
      const result = resolver.formatTags({
        tags,
        savedTags,
      })

      expect(result)
        .toEqual(expected)
    })
  })

  describe('#buildArticle', () => {
    const resolver = AddNewArticleMutationResolver.create()
    const mockNow = new Date('2024-04-10T00:00:00Z')

    const buildCases = [
      {
        name: 'builds article with all associations',
        params: {
          thumbnailUrl: '/images/article.jpg',
          title: 'Test Article',
          content: 'Content',
          postedAt: '2024-04-10T00:00:00Z',
          tagIds: [50001, 50002],
          statusId: 50001,
          savedAt: mockNow,
        },
        expected: {
          ArticleThumbnail: {
            imageUrl: '/images/article.jpg',
            savedAt: mockNow,
          },
          title: 'Test Article',
          content: 'Content',
          postedAt: new Date('2024-04-10T00:00:00Z'),
          savedAt: mockNow,
          ArticleTags: [
            { TagId: 50001, savedAt: mockNow },
            { TagId: 50002, savedAt: mockNow },
          ],
          ArticleLatestStatus: {
            ArticleStatusId: 50001,
            savedAt: mockNow,
          },
        },
      },
    ]

    test.each(buildCases)('$name', ({
      params,
      expected,
    }) => {
      const result = resolver.buildArticle(params)

      expect(result)
        .toMatchObject(expected)
    })
  })

  describe('#schema', () => {
    const resolver = AddNewArticleMutationResolver.create()

    test('returns correct schema name', () => {
      expect(resolver.schema)
        .toBe('addNewArticle')
    })
  })
})
