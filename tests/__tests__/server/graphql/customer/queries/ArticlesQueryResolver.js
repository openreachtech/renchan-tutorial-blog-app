import '../../../../../../sequelize/_.js'

import ArticlesQueryResolver from '../../../../../../server/graphql/resolvers/customer/actual/queries/ArticlesQueryResolver'

describe('ArticlesQueryResolver', () => {
  describe('#resolve', () => {
    const resolver = ArticlesQueryResolver.create()
    const mockContext = {}

    describe('when articles are successfully resolved', () => {
      const successCases = [
        {
          name: 'with technology tag',
          input: {
            tagIds: [50002],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
          expected: {
            articles: [
              {
                articleId: 50002,
                thumbnailUrl: '/images/tech-review-50002.jpg',
                title: 'Tech Review',
                postedAt: new Date('2024-04-02T11:30:00Z'),
                tags: [
                  {
                    tagId: 50002,
                    name: 'technology',
                  },
                ],
              },
              {
                articleId: 50001,
                thumbnailUrl: '/images/breaking-news-50001.jpg',
                title: 'Breaking News Article',
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
            ],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
              totalRecords: 2,
            },
          },
        },
        {
          name: 'with news tag',
          input: {
            tagIds: [50001],
            pagination: {
              limit: 5,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
          expected: {
            articles: [
              {
                articleId: 50004,
                thumbnailUrl: '/images/scheduled-post-50004.jpg',
                title: 'Scheduled Post',
                postedAt: new Date('2024-04-15T00:00:00Z'),
                tags: [
                  {
                    tagId: 50004,
                    name: 'business',
                  },
                  {
                    tagId: 50001,
                    name: 'news',
                  },
                ],
              },
              {
                articleId: 50006,
                thumbnailUrl: '/images/featured-story-50006.jpg',
                title: 'Featured Story',
                postedAt: new Date('2024-04-03T15:45:00Z'),
                tags: [
                  {
                    tagId: 50006,
                    name: 'feature',
                  },
                  {
                    tagId: 50001,
                    name: 'news',
                  },
                ],
              },
              {
                articleId: 50001,
                thumbnailUrl: '/images/breaking-news-50001.jpg',
                title: 'Breaking News Article',
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
            ],
            pagination: {
              limit: 5,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
              totalRecords: 3,
            },
          },
        },
      ]

      test.each(successCases)('$name', async ({
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

    describe('when no articles are found', () => {
      const notFoundCases = [
        {
          name: 'non-existent tag',
          input: {
            tagIds: [99999],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
        },
        {
          name: 'offset exceeds available records',
          input: {
            tagIds: [50001],
            pagination: {
              limit: 10,
              offset: 1000,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
        },
      ]

      test.each(notFoundCases)('$name', async ({
        input,
      }) => {
        await expect(resolver.resolve(
          {
            input,
          },
          mockContext
        )).rejects.toThrow('204.Q002.001')
      })
    })

    describe('when input is invalid', () => {
      const invalidInputCases = [
        {
          name: 'invalid tag IDs',
          input: {
            tagIds: ['invalid'],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
        },
        {
          name: 'invalid pagination limit',
          input: {
            tagIds: [50001],
            pagination: {
              limit: -1,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
        },
        {
          name: 'invalid pagination offset',
          input: {
            tagIds: [50001],
            pagination: {
              limit: 10,
              offset: -1,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
        },
      ]

      test.each(invalidInputCases)('$name', async ({
        input,
      }) => {
        await expect(resolver.resolve(
          {
            input,
          },
          mockContext
        )).rejects.toThrow('203.Q002.002')
      })
    })
  })

  describe('#isInputValid', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when input is valid', () => {
      const validCases = [
        {
          name: 'valid tag IDs and pagination',
          params: {
            tagIds: [1, 2, 3],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
        },
        {
          name: 'valid with title sort',
          params: {
            tagIds: [1],
            pagination: {
              limit: 20,
              offset: 10,
              sort: {
                targetColumn: 'title',
                orderBy: 'ASC',
              },
            },
          },
        },
      ]

      test.each(validCases)('$name', ({
        params,
      }) => {
        expect(resolver.isInputValid(params))
          .toBeTruthy()
      })
    })

    describe('when input is invalid', () => {
      const invalidCases = [
        {
          name: 'invalid tag IDs',
          params: {
            tagIds: ['invalid'],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
        },
        {
          name: 'invalid sort target column',
          params: {
            tagIds: [1],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'invalid',
                orderBy: 'DESC',
              },
            },
          },
        },
        {
          name: 'invalid sort order',
          params: {
            tagIds: [1],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'INVALID',
              },
            },
          },
        },
      ]

      test.each(invalidCases)('$name', ({
        params,
      }) => {
        expect(resolver.isInputValid(params))
          .toBeFalsy()
      })
    })
  })

  describe('#isTagIdsValid', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when tag IDs are valid', () => {
      const validCases = [
        {
          name: 'single positive integer',
          params: {
            tagIds: [1],
          },
        },
        {
          name: 'multiple positive integers',
          params: {
            tagIds: [1, 2, 3],
          },
        },
      ]

      test.each(validCases)('$name', ({
        params,
      }) => {
        expect(resolver.isTagIdsValid(params))
          .toBeTruthy()
      })
    })

    describe('when tag IDs are invalid', () => {
      const invalidCases = [
        {
          name: 'non-array input',
          params: {
            tagIds: 'invalid',
          },
        },
        {
          name: 'array with non-integers',
          params: {
            tagIds: [1, 'invalid', 3],
          },
        },
        {
          name: 'array with zero',
          params: {
            tagIds: [1, 0, 3],
          },
        },
        {
          name: 'array with negative numbers',
          params: {
            tagIds: [1, -2, 3],
          },
        },
      ]

      test.each(invalidCases)('$name', ({
        params,
      }) => {
        expect(resolver.isTagIdsValid(params))
          .toBeFalsy()
      })
    })
  })

  describe('#isPaginationValid', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when pagination is valid', () => {
      const validCases = [
        {
          name: 'valid pagination with default sort',
          params: {
            limit: 10,
            offset: 0,
          },
        },
        {
          name: 'valid pagination with custom sort',
          params: {
            limit: 20,
            offset: 10,
            sort: {
              targetColumn: 'title',
              orderBy: 'ASC',
            },
          },
        },
      ]

      test.each(validCases)('$name', ({
        params,
      }) => {
        expect(resolver.isPaginationValid(params))
          .toBeTruthy()
      })
    })

    describe('when pagination is invalid', () => {
      const invalidCases = [
        {
          name: 'negative limit',
          params: {
            limit: -1,
            offset: 0,
          },
        },
        {
          name: 'negative offset',
          params: {
            limit: 10,
            offset: -1,
          },
        },
        {
          name: 'invalid target column',
          params: {
            limit: 10,
            offset: 0,
            sort: {
              targetColumn: 'invalid',
              orderBy: 'DESC',
            },
          },
        },
        {
          name: 'invalid order by',
          params: {
            limit: 10,
            offset: 0,
            sort: {
              targetColumn: 'postedAt',
              orderBy: 'INVALID',
            },
          },
        },
      ]

      test.each(invalidCases)('$name', ({
        params,
      }) => {
        expect(resolver.isPaginationValid(params))
          .toBeFalsy()
      })
    })
  })

  describe('#schema', () => {
    test('should return correct schema name', () => {
      const resolver = ArticlesQueryResolver.create()

      expect(resolver.schema)
        .toBe('articles')
    })
  })
})
