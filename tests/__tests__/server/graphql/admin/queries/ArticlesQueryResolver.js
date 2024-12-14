import '../../../../../../sequelize/_.js'

import ArticlesQueryResolver from '../../../../../../server/graphql/resolvers/admin/actual/queries/ArticlesQueryResolver.js'

describe('ArticlesQueryResolver', () => {
  describe('#resolve', () => {
    const resolver = ArticlesQueryResolver.create()
    const mockContext = {}

    describe('when articles are successfully resolved', () => {
      const successCases = [
        {
          name: 'with single tag',
          input: {
            tagIds: [50001],
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
                articleId: 50004,
                thumbnailUrl: '/images/scheduled-post-50004.jpg',
                title: 'Scheduled Post',
                postedAt: new Date('2024-04-15T00:00:00Z'),
                savedAt: new Date('2024-04-03T14:30:00Z'),
                tags: [
                  {
                    tagId: 50001,
                    name: 'news',
                  },
                  {
                    tagId: 50004,
                    name: 'business',
                  },
                ],
              },
              {
                articleId: 50006,
                thumbnailUrl: '/images/featured-story-50006.jpg',
                title: 'Featured Story',
                postedAt: new Date('2024-04-03T15:45:00Z'),
                savedAt: new Date('2024-04-03T15:45:00Z'),
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
              {
                articleId: 50001,
                thumbnailUrl: '/images/breaking-news-50001.jpg',
                title: 'Breaking News Article',
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
            ],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
              totalRecords: 3,
            },
          },
        },
        {
          name: 'with multiple tags (OR condition)',
          input: {
            tagIds: [50001, 50002],
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
                savedAt: new Date('2024-04-03T14:30:00Z'),
                tags: [
                  {
                    tagId: 50001,
                    name: 'news',
                  },
                  {
                    tagId: 50004,
                    name: 'business',
                  },
                ],
              },
              {
                articleId: 50006,
                thumbnailUrl: '/images/featured-story-50006.jpg',
                title: 'Featured Story',
                postedAt: new Date('2024-04-03T15:45:00Z'),
                savedAt: new Date('2024-04-03T15:45:00Z'),
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
              {
                articleId: 50002,
                thumbnailUrl: '/images/tech-review-50002.jpg',
                title: 'Tech Review',
                postedAt: new Date('2024-04-02T11:30:00Z'),
                savedAt: new Date('2024-04-02T11:30:00Z'),
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
            ],
            pagination: {
              limit: 5,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
              totalRecords: 4,
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

    describe('when pagination input is invalid', () => {
      const invalidPaginationCases = [
        {
          name: 'negative limit',
          input: {
            tagIds: [50001],
            pagination: {
              limit: -1,
              offset: 0,
            },
          },
        },
        {
          name: 'zero limit',
          input: {
            tagIds: [50001],
            pagination: {
              limit: 0,
              offset: 0,
            },
          },
        },
        {
          name: 'negative offset',
          input: {
            tagIds: [50001],
            pagination: {
              limit: 10,
              offset: -1,
            },
          },
        },
        {
          name: 'invalid sort column',
          input: {
            tagIds: [50001],
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
          input: {
            tagIds: [50001],
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

      test.each(invalidPaginationCases)('$name', async ({
        input,
      }) => {
        await expect(resolver.resolve(
          {
            input,
          },
          mockContext
        ))
          .rejects
          .toThrow('203.Q003.006')
      })
    })

    describe('when tag IDs are invalid', () => {
      const invalidTagIdsCases = [
        {
          name: 'negative tag ID',
          input: {
            tagIds: [-1],
            pagination: {
              limit: 10,
              offset: 0,
            },
          },
        },
        {
          name: 'zero tag ID',
          input: {
            tagIds: [0],
            pagination: {
              limit: 10,
              offset: 0,
            },
          },
        },
        {
          name: 'non-integer tag ID',
          input: {
            tagIds: [1.5],
            pagination: {
              limit: 10,
              offset: 0,
            },
          },
        },
      ]

      test.each(invalidTagIdsCases)('$name', async ({
        input,
      }) => {
        await expect(resolver.resolve(
          {
            input,
          },
          mockContext
        ))
          .rejects
          .toThrow('203.Q003.005')
      })
    })
  })

  describe('#isPaginationValid', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when pagination is valid', () => {
      const validCases = [
        {
          name: 'valid pagination without sort',
          params: {
            pagination: {
              limit: 10,
              offset: 0,
            },
          },
          expected: true,
        },
        {
          name: 'valid pagination with sort',
          params: {
            pagination: {
              limit: 20,
              offset: 10,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
          expected: true,
        },
        {
          name: 'valid pagination with different sort column',
          params: {
            pagination: {
              limit: 5,
              offset: 15,
              sort: {
                targetColumn: 'savedAt',
                orderBy: 'ASC',
              },
            },
          },
          expected: true,
        },
      ]

      test.each(validCases)('$name', ({
        params,
        expected,
      }) => {
        expect(resolver.isPaginationValid(params))
          .toBe(expected)
      })
    })

    describe('when pagination is invalid', () => {
      const invalidCases = [
        {
          name: 'negative limit',
          params: {
            pagination: {
              limit: -1,
              offset: 0,
            },
          },
          expected: false,
        },
        {
          name: 'zero limit',
          params: {
            pagination: {
              limit: 0,
              offset: 0,
            },
          },
          expected: false,
        },
        {
          name: 'negative offset',
          params: {
            pagination: {
              limit: 10,
              offset: -1,
            },
          },
          expected: false,
        },
        {
          name: 'non-integer limit',
          params: {
            pagination: {
              limit: 10.5,
              offset: 0,
            },
          },
          expected: false,
        },
        {
          name: 'non-integer offset',
          params: {
            pagination: {
              limit: 10,
              offset: 1.5,
            },
          },
          expected: false,
        },
        {
          name: 'invalid sort column',
          params: {
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'invalid',
                orderBy: 'DESC',
              },
            },
          },
          expected: false,
        },
        {
          name: 'invalid sort order',
          params: {
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'INVALID',
              },
            },
          },
          expected: false,
        },
      ]

      test.each(invalidCases)('$name', ({
        params,
        expected,
      }) => {
        expect(resolver.isPaginationValid(params))
          .toBe(expected)
      })
    })
  })

  describe('#isTagIdsValid', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when tag IDs are valid', () => {
      const validCases = [
        {
          name: 'single tag ID',
          params: {
            tagIds: [50001],
          },
          expected: true,
        },
        {
          name: 'multiple tag IDs',
          params: {
            tagIds: [50001, 50002, 50003],
          },
          expected: true,
        },
      ]

      test.each(validCases)('$name', ({
        params,
        expected,
      }) => {
        expect(resolver.isTagIdsValid(params))
          .toBe(expected)
      })
    })

    describe('when tag IDs are invalid', () => {
      const invalidCases = [
        {
          name: 'negative tag ID',
          params: {
            tagIds: [-1],
          },
          expected: false,
        },
        {
          name: 'zero tag ID',
          params: {
            tagIds: [0],
          },
          expected: false,
        },
        {
          name: 'non-integer tag ID',
          params: {
            tagIds: [1.5],
          },
          expected: false,
        },
        {
          name: 'mixed valid and invalid tag IDs',
          params: {
            tagIds: [50001, -1, 2.5],
          },
          expected: false,
        },
      ]

      test.each(invalidCases)('$name', ({
        params,
        expected,
      }) => {
        expect(resolver.isTagIdsValid(params))
          .toBe(expected)
      })
    })
  })

  describe('#countArticles', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when counting articles with tags', () => {
      const countCases = [
        {
          name: 'single tag',
          params: {
            tagIds: [50001],
          },
          expected: 3, // Breaking News, Scheduled Post, Featured Story
        },
        {
          name: 'multiple tags (OR condition)',
          params: {
            tagIds: [50001, 50002],
          },
          expected: 4, // Breaking News, Tech Review, Scheduled Post, Featured Story
        },
        {
          name: 'tag with single article',
          params: {
            tagIds: [50003],
          },
          expected: 1, // Draft Article
        },
        {
          name: 'non-existent tag',
          params: {
            tagIds: [99999],
          },
          expected: 0,
        },
      ]

      test.each(countCases)('$name', async ({
        params,
        expected,
      }) => {
        const count = await resolver.countArticles(params)

        expect(count)
          .toBe(expected)
      })
    })
  })

  describe('#findArticles', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when finding articles with various filters', () => {
      const findCases = [
        {
          name: 'single tag with default sorting',
          params: {
            tagIds: [50001],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
          expectedResults: {
            length: 3,
            firstArticle: {
              id: 50004,
              title: 'Scheduled Post',
              ArticleTags: expect.arrayContaining([
                expect.objectContaining({
                  Tag: expect.objectContaining({
                    id: 50001,
                    name: 'news',
                  }),
                }),
              ]),
            },
          },
        },
        {
          name: 'multiple tags with custom sorting',
          params: {
            tagIds: [50001, 50002],
            pagination: {
              limit: 5,
              offset: 0,
              sort: {
                targetColumn: 'savedAt',
                orderBy: 'ASC',
              },
            },
          },
          expectedResults: {
            length: 4,
            firstArticle: {
              id: 50001,
              title: 'Breaking News Article',
              ArticleTags: expect.arrayContaining([
                expect.objectContaining({
                  Tag: expect.objectContaining({
                    id: 50001,
                    name: 'news',
                  }),
                }),
                expect.objectContaining({
                  Tag: expect.objectContaining({
                    id: 50002,
                    name: 'technology',
                  }),
                }),
              ]),
            },
          },
        },
        {
          name: 'with pagination offset',
          params: {
            tagIds: [50001, 50002],
            pagination: {
              limit: 2,
              offset: 2,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
            },
          },
          expectedResults: {
            length: 2,
            firstArticle: {
              id: 50002,
              title: 'Tech Review',
              ArticleTags: expect.arrayContaining([
                expect.objectContaining({
                  Tag: expect.objectContaining({
                    id: 50002,
                    name: 'technology',
                  }),
                }),
              ]),
            },
          },
        },
      ]

      test.each(findCases)('$name', async ({
        params,
        expectedResults,
      }) => {
        const results = await resolver.findArticles(params)

        expect(results)
          .toHaveLength(expectedResults.length)
        expect(results[0])
          .toMatchObject(expectedResults.firstArticle)
      })
    })
  })

  describe('#formatResponse', () => {
    const resolver = ArticlesQueryResolver.create()

    describe('when formatting article response', () => {
      const formatCases = [
        {
          name: 'single article with all associations',
          params: {
            articles: [
              {
                id: 50001,
                title: 'Breaking News Article',
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
            ],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
              totalRecords: 1,
            },
          },
          expected: {
            articles: [
              {
                articleId: 50001,
                thumbnailUrl: '/images/breaking-news-50001.jpg',
                title: 'Breaking News Article',
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
            ],
            pagination: {
              limit: 10,
              offset: 0,
              sort: {
                targetColumn: 'postedAt',
                orderBy: 'DESC',
              },
              totalRecords: 1,
            },
          },
        },
        {
          name: 'multiple articles with various associations',
          params: {
            articles: [
              {
                id: 50004,
                title: 'Scheduled Post',
                postedAt: new Date('2024-04-15T00:00:00Z'),
                savedAt: new Date('2024-04-03T14:30:00Z'),
                ArticleThumbnail: {
                  imageUrl: '/images/scheduled-post-50004.jpg',
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
                      id: 50004,
                      name: 'business',
                    },
                  },
                ],
              },
              {
                id: 50002,
                title: 'Tech Review',
                postedAt: new Date('2024-04-02T11:30:00Z'),
                savedAt: new Date('2024-04-02T11:30:00Z'),
                ArticleThumbnail: {
                  imageUrl: '/images/tech-review-50002.jpg',
                },
                ArticleTags: [
                  {
                    Tag: {
                      id: 50002,
                      name: 'technology',
                    },
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
          expected: {
            articles: [
              {
                articleId: 50004,
                thumbnailUrl: '/images/scheduled-post-50004.jpg',
                title: 'Scheduled Post',
                postedAt: new Date('2024-04-15T00:00:00Z'),
                savedAt: new Date('2024-04-03T14:30:00Z'),
                tags: [
                  {
                    tagId: 50001,
                    name: 'news',
                  },
                  {
                    tagId: 50004,
                    name: 'business',
                  },
                ],
              },
              {
                articleId: 50002,
                thumbnailUrl: '/images/tech-review-50002.jpg',
                title: 'Tech Review',
                postedAt: new Date('2024-04-02T11:30:00Z'),
                savedAt: new Date('2024-04-02T11:30:00Z'),
                tags: [
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
      ]

      test.each(formatCases)('$name', ({
        params,
        expected,
      }) => {
        const result = resolver.formatResponse(params)

        expect(result)
          .toEqual(expected)
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
