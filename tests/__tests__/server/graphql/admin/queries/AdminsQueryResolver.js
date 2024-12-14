import '../../../../../../sequelize/_'

import AdminsQueryResolver from '../../../../../../server/graphql/resolvers/admin/actual/queries/AdminsQueryResolver'

describe('AdminsQueryResolver', () => {
  describe('#resolve', () => {
    const resolver = AdminsQueryResolver.create()
    const mockContext = {}

    describe('when pagination is valid', () => {
      const successCases = [
        {
          name: 'with default sort',
          input: {
            pagination: {
              limit: 5,
              offset: 0,
            },
          },
          expected: {
            admins: [
              {
                adminId: 50010,
                username: 'admin_regular',
                email: 'regular.admin@example.com',
                registeredAt: new Date('2024-04-10T12:00:00Z'),
              },
              {
                adminId: 50009,
                username: 'admin_start',
                email: 'start.admin@example.com',
                registeredAt: new Date('2024-04-01T00:00:01Z'),
              },
              {
                adminId: 50008,
                username: 'admin_end',
                email: 'end.admin@example.com',
                registeredAt: new Date('2024-03-31T23:59:59Z'),
              },
              {
                adminId: 50007,
                username: 'admin_new',
                email: 'new.admin@example.com',
                registeredAt: new Date('2024-03-15T16:45:00Z'),
              },
              {
                adminId: 50006,
                username: 'admin_temp',
                email: 'temp.admin@example.com',
                registeredAt: new Date('2024-03-01T08:00:00Z'),
              },
            ],
            pagination: {
              limit: 5,
              offset: 0,
              totalRecords: 10,
            },
          },
        },
        {
          name: 'with custom sort by registeredAt ASC',
          input: {
            pagination: {
              limit: 3,
              offset: 0,
              sort: {
                targetColumn: 'registeredAt',
                orderBy: 'ASC',
              },
            },
          },
          expected: {
            admins: [
              {
                adminId: 50001,
                username: 'admin_super',
                email: 'super.admin@example.com',
                registeredAt: new Date('2024-01-01T00:00:00Z'),
              },
              {
                adminId: 50002,
                username: 'admin_content',
                email: 'content.admin@example.com',
                registeredAt: new Date('2024-01-02T10:00:00Z'),
              },
              {
                adminId: 50003,
                username: 'admin_viewer',
                email: 'viewer.admin@example.com',
                registeredAt: new Date('2024-01-03T12:30:00Z'),
              },
            ],
            pagination: {
              limit: 3,
              offset: 0,
              sort: {
                targetColumn: 'registeredAt',
                orderBy: 'ASC',
              },
              totalRecords: 10,
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

    describe('when pagination is invalid', () => {
      const invalidCases = [
        {
          name: 'negative limit',
          input: {
            pagination: {
              limit: -1,
              offset: 0,
            },
          },
          errorCode: '203.Q001.002',
        },
        {
          name: 'zero limit',
          input: {
            pagination: {
              limit: 0,
              offset: 0,
            },
          },
          errorCode: '203.Q001.002',
        },
        {
          name: 'float limit',
          input: {
            pagination: {
              limit: 1.5,
              offset: 0,
            },
          },
          errorCode: '203.Q001.002',
        },
        {
          name: 'negative offset',
          input: {
            pagination: {
              limit: 5,
              offset: -1,
            },
          },
          errorCode: '203.Q001.002',
        },
        {
          name: 'float offset',
          input: {
            pagination: {
              limit: 5,
              offset: 1.5,
            },
          },
          errorCode: '203.Q001.002',
        },
        {
          name: 'invalid sort column',
          input: {
            pagination: {
              limit: 5,
              offset: 0,
              sort: {
                targetColumn: 'invalid',
                orderBy: 'DESC',
              },
            },
          },
          errorCode: '203.Q001.002',
        },
        {
          name: 'invalid sort order',
          input: {
            pagination: {
              limit: 5,
              offset: 0,
              sort: {
                targetColumn: 'registeredAt',
                orderBy: 'INVALID',
              },
            },
          },
          errorCode: '203.Q001.002',
        },
      ]

      test.each(invalidCases)('$name', async ({
        input,
        errorCode,
      }) => {
        await expect(resolver.resolve(
          {
            input,
          },
          mockContext
        ))
          .rejects.toThrow(errorCode)
      })
    })
  })

  describe('#isPaginationValid', () => {
    describe('when pagination input is valid', () => {
      const validCases = [
        {
          name: 'with default sort',
          params: {
            limit: 10,
            offset: 0,
          },
        },
      ]

      test.each(validCases)('$name', ({
        params,
      }) => {
        const resolver = AdminsQueryResolver.create()

        expect(resolver.isPaginationValid(params))
          .toBeTruthy()
      })
    })

    describe('when pagination input is invalid', () => {
      const invalidCases = [
        {
          name: 'negative limit',
          params: {
            limit: -1,
            offset: 0,
          },
          errorCode: '203.Q001.003',
        },
        {
          name: 'zero limit',
          params: {
            limit: 0,
            offset: 0,
          },
        },
        {
          name: 'float limit',
          params: {
            limit: 1.5,
            offset: 0,
          },
        },
        {
          name: 'negative offset',
          params: {
            limit: 5,
            offset: -1,
          },
        },
        {
          name: 'float offset',
          params: {
            limit: 5,
            offset: 1.5,
          },
        },
        {
          name: 'invalid sort column',
          params: {
            limit: 5,
            offset: 0,
            sort: {
              targetColumn: 'invalid',
              orderBy: 'DESC',
            },
          },
        },
        {
          name: 'invalid sort order',
          params: {
            limit: 5,
            offset: 0,
            sort: {
              targetColumn: 'registeredAt',
              orderBy: 'INVALID',
            },
          },
        },
      ]

      test.each(invalidCases)('$name', ({
        params,
        errorCode,
      }) => {
        const resolver = AdminsQueryResolver.create()
        const actual = resolver.isPaginationValid(params)

        expect(actual)
          .toBeFalsy()
      })
    })
  })

  describe('#findAdmins', () => {
    const resolver = AdminsQueryResolver.create()

    describe('when finding admins with pagination', () => {
      const cases = [
        {
          name: 'default sort by registeredAt DESC',
          params: {
            pagination: {
              limit: 2,
              offset: 0,
            },
          },
          expected: [
            {
              id: 50010,
              AdminUsername: { username: 'admin_regular' },
              AdminSecret: { email: 'regular.admin@example.com' },
              registeredAt: new Date('2024-04-10T12:00:00Z'),
            },
            {
              id: 50009,
              AdminUsername: { username: 'admin_start' },
              AdminSecret: { email: 'start.admin@example.com' },
              registeredAt: new Date('2024-04-01T00:00:01Z'),
            },
          ],
        },
        {
          name: 'sort by registeredAt ASC',
          params: {
            pagination: {
              limit: 2,
              offset: 0,
              sort: {
                targetColumn: 'registeredAt',
                orderBy: 'ASC',
              },
            },
          },
          expected: [
            {
              id: 50001,
              registeredAt: new Date('2024-01-01T00:00:00Z'),
            },
            {
              id: 50002,
              registeredAt: new Date('2024-01-02T10:00:00Z'),
            },
          ],
        },
      ]

      test.each(cases)('$name', async ({
        params,
        expected,
      }) => {
        const result = await resolver.findAdmins(params)

        expect(result)
          .toMatchObject(expected)
      })
    })
  })

  describe('#countAdmins', () => {
    test('should return total number of admins', async () => {
      const resolver = AdminsQueryResolver.create()
      const result = await resolver.countAdmins()
      const EXPECTED_ADMINS = 10

      expect(result)
        .toBe(EXPECTED_ADMINS)
    })
  })

  describe('#formatResponse', () => {
    const cases = [
      {
        name: 'should format response correctly',
        params: {
          admins: [
            {
              id: 50001,
              AdminUsername: { username: 'admin_super' },
              AdminSecret: { email: 'super.admin@example.com' },
              registeredAt: new Date('2024-01-01T00:00:00Z'),
            },
            {
              id: 50002,
              AdminUsername: { username: 'admin_content' },
              AdminSecret: { email: 'content.admin@example.com' },
              registeredAt: new Date('2024-01-02T10:00:00Z'),
            },
          ],
          pagination: {
            limit: 2,
            offset: 0,
            sort: {
              targetColumn: 'registeredAt',
              orderBy: 'DESC',
            },
          },
          totalRecords: 10,
        },
        expected: {
          admins: [
            {
              adminId: 50001,
              username: 'admin_super',
              email: 'super.admin@example.com',
              registeredAt: new Date('2024-01-01T00:00:00Z'),
            },
            {
              adminId: 50002,
              username: 'admin_content',
              email: 'content.admin@example.com',
              registeredAt: new Date('2024-01-02T10:00:00Z'),
            },
          ],
          pagination: {
            limit: 2,
            offset: 0,
            sort: {
              targetColumn: 'registeredAt',
              orderBy: 'DESC',
            },
            totalRecords: 10,
          },
        },
      },
    ]

    test.each(cases)('$name', ({
      params,
      expected,
    }) => {
      const resolver = AdminsQueryResolver.create()
      const result = resolver.formatResponse(params)

      expect(result)
        .toEqual(expected)
    })
  })

  describe('#schema', () => {
    test('should return correct schema name', () => {
      const resolver = AdminsQueryResolver.create()

      expect(resolver.schema)
        .toBe('admins')
    })
  })
})
