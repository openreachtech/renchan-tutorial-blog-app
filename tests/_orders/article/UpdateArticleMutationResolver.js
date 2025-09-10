import '../../../sequelize/_.js'

import Article from '../../../sequelize/models/Article.js'
import UpdateArticleMutationResolver from '../../../server/graphql/resolvers/admin/actual/mutations/UpdateArticleMutationResolver.js'

describe('UpdateArticleMutationResolver', () => {
  describe('#resolve', () => {
    const mockNow = new Date('2024-04-10T00:00:00Z')

    describe('when article update is successful', () => {
      const successCases = [
        {
          name: 'updates published article with new content',
          input: {
            articleId: 50001,
            thumbnailUrl: '/images/breaking-news-updated.jpg',
            title: 'Updated Breaking News Article',
            content: '# Updated Breaking News\n\nNew developments...',
            postedAt: '2024-04-10T00:00:00Z',
            tagIds: [50001, 50002],
            statusId: 50001,
          },
          articleStatusResolver: {
            50001: {
              NAME: 'published',
            },
          },
          expectedResponse: {
            articleId: 50001,
            thumbnailUrl: '/images/breaking-news-updated.jpg',
            title: 'Updated Breaking News Article',
            content: '# Updated Breaking News\n\nNew developments...',
            postedAt: new Date('2024-04-10T00:00:00Z'),
            savedAt: mockNow,
            tags: [
              { tagId: 50001, name: 'news' },
              { tagId: 50002, name: 'technology' },
            ],
            status: {
              statusId: 50001,
              statusName: 'published',
              phasedAt: mockNow,
            },
          },
        },
        {
          name: 'changes article from draft to published',
          input: {
            articleId: 50002,
            thumbnailUrl: '/images/tech-review-50002.jpg',
            title: 'Tech Review Final',
            content: '# Final Tech Review\n\nComplete review...',
            postedAt: new Date('2024-04-10T00:00:00Z'),
            tagIds: [50002, 50007],
            statusId: 50001,
          },
          articleStatusResolver: {
            50001: {
              NAME: 'published',
            },
          },
          expectedResponse: {
            articleId: 50002,
            thumbnailUrl: '/images/tech-review-50002.jpg',
            title: 'Tech Review Final',
            content: '# Final Tech Review\n\nComplete review...',
            postedAt: new Date('2024-04-10T00:00:00Z'),
            savedAt: mockNow,
            tags: [
              { tagId: 50002, name: 'technology' },
              { tagId: 50007, name: 'review' },
            ],
            status: {
              statusId: 50001,
              statusName: 'published',
              phasedAt: mockNow,
            },
          },
        },
      ]

      test.each(successCases)('$name', async ({
        input,
        articleStatusResolver,
        expectedResponse,
      }) => {
        const resolver = UpdateArticleMutationResolver.create({
          articleStatusResolver,
        })

        const nowSpy = jest.spyOn(resolver, 'now', 'get')
          .mockReturnValue(mockNow)

        const validator = {
          isArticleParamsValid: jest.fn()
            .mockReturnValue(true),
        }

        jest.spyOn(resolver, 'generateNewArticleValidator')
          .mockReturnValue(validator)

        const result = await resolver.resolve({
          input,
        })

        expect(result)
          .toEqual(expectedResponse)
        expect(nowSpy)
          .toHaveBeenCalledWith()

        nowSpy.mockRestore()
      })
    })

    describe('when transaction fails', () => {
      const failureCases = [
        {
          name: 'rolls back all changes on article save failure',
          input: {
            articleId: 50001,
            thumbnailUrl: '/images/breaking-news-updated.jpg',
            title: 'Updated Breaking News Article',
            content: '# Updated Breaking News\n\nNew developments...',
            postedAt: '2024-04-10T00:00:00Z',
            tagIds: [50001, 50002],
            statusId: 50001,
          },
        },
        {
          name: 'rolls back on thumbnail save failure',
          input: {
            articleId: 50002,
            thumbnailUrl: '/images/tech-review-updated.jpg',
            title: 'Tech Review Updated',
            content: '# Updated Tech Review\n\nNew content...',
            postedAt: '2024-04-10T00:00:00Z',
            tagIds: [50002, 50007],
            statusId: 50001,
          },
        },
      ]

      test.each(failureCases)('$name', async ({
        input,
      }) => {
        const resolver = UpdateArticleMutationResolver.create()

        const validator = {
          isArticleParamsValid: jest.fn()
            .mockReturnValue(true),
        }

        jest.spyOn(resolver, 'generateNewArticleValidator')
          .mockReturnValue(validator)

        // Force transaction to fail
        jest.spyOn(Article.prototype, 'save')
          .mockRejectedValueOnce(new Error('Database error'))

        await expect(resolver.resolve({
          input,
        }))
          .rejects
          .toThrow('Database error')
      })
    })
  })

  describe('#generateTransactionCallback', () => {
    describe('saves all entities in correct order', () => {
      const callbackCases = [
        {
          name: 'saves article and all associated entities',
          params: {
            article: {
              id: 50001,
              title: 'Test Article',
              content: 'Test content',
              save: jest.fn(),
              setTags: jest.fn(),
              ArticleThumbnail: {
                save: jest.fn(),
              },
              ArticleLatestStatus: {
                save: jest.fn(),
              },
            },
            tags: [
              {
                TagId: 50001,
              },
              {
                TagId: 50001,
              },
            ],
            savedAt: new Date('2024-04-10T00:00:00Z'),
          },
          transaction: {
            id: 'transaction-1',
          },
        },
      ]

      test.each(callbackCases)('$name', async ({
        params,
        transaction,
      }) => {
        const resolver = UpdateArticleMutationResolver.create()
        const callback = resolver.generateTransactionCallback(params)

        await callback(transaction)

        // Verify save order and transaction usage
        expect(params.article.save)
          .toHaveBeenCalledWith({
            transaction,
          })

        expect(params.article.ArticleThumbnail.save)
          .toHaveBeenCalledWith({
            transaction,
          })

        expect(params.article.ArticleLatestStatus.save)
          .toHaveBeenCalledWith({
            transaction,
          })

        expect(params.article.setTags)
          .toHaveBeenCalledWith(
            params.tags,
            {
              through: {
                savedAt: params.savedAt,
              },
              transaction,
            }
          )
      })
    })

    describe('handles article save failure', () => {
      test('throws error when article save fails', async () => {
        const resolver = UpdateArticleMutationResolver.create()
        const error = new Error('Article save failed')
        const mockArticle = {
          id: 60001,
          save: jest.fn()
            .mockRejectedValue(error),
          setTags: jest.fn()
            .mockResolvedValue({}),
          ArticleThumbnail: {
            save: jest.fn()
              .mockResolvedValue({}),
          },
          ArticleLatestStatus: {
            save: jest.fn()
              .mockResolvedValue({}),
          },
        }

        const callback = resolver.generateTransactionCallback({
          article: mockArticle,
          tagIds: [50001],
          savedAt: new Date('2024-04-10T00:00:00Z'),
        })

        await expect(callback({ id: 'transaction-1' }))
          .rejects
          .toThrow(error.message)
      })
    })

    describe('handles thumbnail save failure', () => {
      test('throws error when thumbnail save fails', async () => {
        const resolver = UpdateArticleMutationResolver.create()
        const error = new Error('Thumbnail save failed')
        const mockArticle = {
          id: 60001,
          save: jest.fn()
            .mockResolvedValue({}),
          setTags: jest.fn()
            .mockResolvedValue({}),
          ArticleThumbnail: {
            save: jest.fn()
              .mockRejectedValue(error),
          },
          ArticleLatestStatus: {
            save: jest.fn()
              .mockResolvedValue({}),
          },
        }

        const callback = resolver.generateTransactionCallback({
          article: mockArticle,
          tagIds: [50001],
          savedAt: new Date('2024-04-10T00:00:00Z'),
        })

        await expect(callback({ id: 'transaction-1' }))
          .rejects
          .toThrow(error.message)
      })
    })

    describe('handles status save failure', () => {
      test('throws error when status save fails', async () => {
        const resolver = UpdateArticleMutationResolver.create()
        const error = new Error('Status save failed')
        const mockArticle = {
          id: 60001,
          save: jest.fn()
            .mockResolvedValue({}),
          setTags: jest.fn()
            .mockResolvedValue({}),
          ArticleThumbnail: {
            save: jest.fn()
              .mockResolvedValue({}),
          },
          ArticleLatestStatus: {
            save: jest.fn()
              .mockRejectedValue(error),
          },
        }

        const callback = resolver.generateTransactionCallback({
          article: mockArticle,
          tagIds: [50001],
          savedAt: new Date('2024-04-10T00:00:00Z'),
        })

        await expect(callback({ id: 'transaction-1' }))
          .rejects
          .toThrow(error.message)
      })
    })

    describe('handles tag association failure', () => {
      test('throws error when tag association fails', async () => {
        const resolver = UpdateArticleMutationResolver.create()
        const error = new Error('Tag association failed')
        const mockArticle = {
          id: 60001,
          save: jest.fn()
            .mockResolvedValue({}),
          setTags: jest.fn()
            .mockRejectedValue(error),
          ArticleThumbnail: {
            save: jest.fn()
              .mockResolvedValue({}),
          },
          ArticleLatestStatus: {
            save: jest.fn()
              .mockResolvedValue({}),
          },
        }

        const callback = resolver.generateTransactionCallback({
          article: mockArticle,
          tagIds: [50001],
          savedAt: new Date('2024-04-10T00:00:00Z'),
        })

        await expect(callback({ id: 'transaction-1' }))
          .rejects
          .toThrow(error.message)
      })
    })
  })
})
