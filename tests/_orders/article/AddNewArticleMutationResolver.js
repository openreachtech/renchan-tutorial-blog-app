import '../../../sequelize/_.js'

import AddNewArticleMutationResolver from '../../../server/graphql/resolvers/admin/actual/mutations/AddNewArticleMutationResolver.js'

describe('AddNewArticleMutationResolver', () => {
  describe('#resolve', () => {
    const mockNow = new Date('2024-04-10T00:00:00Z')

    describe('when article creation is successful', () => {
      const successCases = [
        {
          name: 'creates article with all valid fields',
          input: {
            thumbnailUrl: '/images/new-article-1.jpg',
            title: 'New Tech Article',
            content: '# New Technology\n\nExciting developments in tech...',
            postedAt: '2024-04-10T00:00:00Z',
            tagIds: [50001, 50002],
            statusId: 50001,
          },
          articleStatusResolver: {
            50001: {
              ID: 50001,
              NAME: 'published',
            },
          },
          expectedResponse: {
            articleId: expect.any(Number),
            thumbnailUrl: '/images/new-article-1.jpg',
            title: 'New Tech Article',
            content: '# New Technology\n\nExciting developments in tech...',
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
      ]

      test.each(successCases)('$name', async ({
        input,
        articleStatusResolver,
        expectedResponse,
      }) => {
        const resolver = AddNewArticleMutationResolver.create({
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

    describe('when validation fails', () => {
      const invalidCases = [
        {
          name: 'invalid input parameters',
          input: {
            thumbnailUrl: '',
            title: '',
            content: '',
            postedAt: 'invalid-date',
            tagIds: [],
            statusId: 0,
          },
        },
      ]

      test.each(invalidCases)('$name', async ({
        input,
      }) => {
        const resolver = AddNewArticleMutationResolver.create()
        const validator = {
          isArticleParamsValid: jest.fn()
            .mockReturnValue(false),
        }

        jest.spyOn(resolver, 'generateNewArticleValidator')
          .mockReturnValue(validator)

        await expect(resolver.resolve({
          input,
        }))
          .rejects
          .toThrow('203.M001.001')
      })
    })

    describe('when tags are not found', () => {
      const notFoundCases = [
        {
          name: 'some tags do not exist',
          input: {
            thumbnailUrl: '/images/article.jpg',
            title: 'Test Article',
            content: 'Content',
            postedAt: '2024-04-10T00:00:00Z',
            tagIds: [50001, 99999],
            statusId: 50001,
          },
          foundTags: [
            { id: 50001, name: 'news' },
          ],
        },
      ]

      test.each(notFoundCases)('$name', async ({
        input,
        foundTags,
      }) => {
        const resolver = AddNewArticleMutationResolver.create()

        const validator = {
          isArticleParamsValid: jest.fn()
            .mockReturnValue(true),
        }

        jest.spyOn(resolver, 'generateNewArticleValidator')
          .mockReturnValue(validator)

        jest.spyOn(resolver, 'findTags')
          .mockResolvedValue(foundTags)

        await expect(resolver.resolve({
          input,
        }))
          .rejects
          .toThrow('204.M001.009')
      })
    })
  })

  describe('#generateTransactionCallback', () => {
    const resolver = AddNewArticleMutationResolver.create()

    describe('transaction callback behavior', () => {
      const callbackCases = [
        {
          name: 'saves article with transaction',
          article: {
            save: jest.fn(),
          },
          transaction: {
            id: 'transaction-1',
          },
        },
      ]

      test.each(callbackCases)('$name', async ({
        article,
        transaction,
      }) => {
        const callback = resolver.generateTransactionCallback({
          article,
        })

        await callback(transaction)

        expect(article.save)
          .toHaveBeenCalledWith({
            transaction,
          })
      })
    })
  })
})
