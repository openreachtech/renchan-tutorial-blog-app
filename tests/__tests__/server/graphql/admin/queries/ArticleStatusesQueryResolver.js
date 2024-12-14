import '../../../../../../sequelize/_.js'

import ArticleStatus from '../../../../../../sequelize/models/ArticleStatus.js'
import ArticleStatusesQueryResolver from '../../../../../../server/graphql/resolvers/admin/actual/queries/ArticleStatusesQueryResolver.js'

describe('ArticleStatusesQueryResolver', () => {
  describe('#resolve', () => {
    const resolver = ArticleStatusesQueryResolver.create()
    const mockContext = {}

    describe('when statuses are successfully resolved', () => {
      const successCases = [
        {
          name: 'all article statuses',
          expected: {
            statuses: [
              {
                statusId: 50001,
                name: 'published',
              },
              {
                statusId: 50002,
                name: 'draft',
              },
              {
                statusId: 50003,
                name: 'pending_review',
              },
              {
                statusId: 50004,
                name: 'scheduled',
              },
              {
                statusId: 50005,
                name: 'archived',
              },
            ],
          },
        },
      ]

      test.each(successCases)('should resolve $name successfully', async ({
        expected,
      }) => {
        const result = await resolver.resolve(
          {},
          mockContext
        )

        expect(result)
          .toEqual(expected)
      })
    })
  })

  describe('#findStatuses', () => {
    const resolver = ArticleStatusesQueryResolver.create()

    describe('when finding all statuses', () => {
      const findStatusesCases = [
        {
          name: 'all article statuses ordered by id',
          expected: [
            {
              id: 50001,
              name: 'published',
              description: 'Article is live and visible to public',
            },
            {
              id: 50002,
              name: 'draft',
              description: 'Article is in draft state',
            },
            {
              id: 50003,
              name: 'pending_review',
              description: 'Article is awaiting editorial review',
            },
            {
              id: 50004,
              name: 'scheduled',
              description: 'Article is scheduled for future publication',
            },
            {
              id: 50005,
              name: 'archived',
              description: 'Article has been archived',
            },
          ],
        },
      ]

      test.each(findStatusesCases)('should find $name', async ({
        expected,
      }) => {
        const result = await resolver.findStatuses()

        expect(result.map(status => ({
          id: status.id,
          name: status.name,
          description: status.description,
        })))
          .toEqual(expected)
      })
    })
  })

  describe('#formatResponse', () => {
    const resolver = ArticleStatusesQueryResolver.create()

    describe('when formatting response', () => {
      const formatResponseCases = [
        {
          name: 'should format article statuses correctly',
          params: {
            statuses: [
              ArticleStatus.build({
                id: 50001,
                name: 'published',
                description: 'Article is live and visible to public',
              }),
              ArticleStatus.build({
                id: 50002,
                name: 'draft',
                description: 'Article is in draft state',
              }),
            ],
          },
          expected: {
            statuses: [
              {
                statusId: 50001,
                name: 'published',
              },
              {
                statusId: 50002,
                name: 'draft',
              },
            ],
          },
        },
      ]

      test.each(formatResponseCases)('$name', ({
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
      const resolver = ArticleStatusesQueryResolver.create()

      expect(resolver.schema)
        .toBe('articleStatuses')
    })
  })
})
