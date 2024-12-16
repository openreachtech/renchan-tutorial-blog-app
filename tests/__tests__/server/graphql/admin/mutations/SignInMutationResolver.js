import '../../../../../../sequelize/_.js'

import {
  BaseMutationResolver,
} from '@openreachtech/renchan'
import AdminAccessToken from '../../../../../../sequelize/models/AdminAccessToken.js'
import SignInMutationResolver from '../../../../../../server/graphql/resolvers/admin/actual/mutations/SignInMutationResolver.js'

describe('SignInMutationResolver', () => {
  describe('super class', () => {
    test('to be BaseMutationResolver', () => {
      const actual = SignInMutationResolver.prototype

      expect(actual)
        .toBeInstanceOf(BaseMutationResolver)
    })
  })
})

describe('SignInMutationResolver', () => {
  describe('#findPasswordHashByEmail()', () => {
    const resolver = SignInMutationResolver.create()

    describe('when email exists', () => {
      const existingEmailCases = [
        {
          name: 'super admin',
          params: {
            email: 'super.admin@example.com',
          },
          expected: {
            AdminId: 50001,
          },
        },
        {
          name: 'content admin',
          params: {
            email: 'content.admin@example.com',
          },
          expected: {
            AdminId: 50002,
          },
        },
      ]

      test.each(existingEmailCases)('should find password hash for $name', async ({
        params,
        expected,
      }) => {
        const result = await resolver.findPasswordHashByEmail(params)

        expect(result)
          .toHaveProperty('AdminId', expected.AdminId)
      })
    })

    describe('when email does not exist', () => {
      const nonExistentEmailCases = [
        {
          name: 'unknown email',
          params: {
            email: 'unknown@example.com',
          },
        },
        {
          name: 'empty email',
          params: {
            email: '',
          },
        },
      ]

      test.each(nonExistentEmailCases)('should return null for $name', async ({
        params,
      }) => {
        const result = await resolver.findPasswordHashByEmail(params)

        expect(result)
          .toBeNull()
      })
    })
  })
})

describe('SignInMutationResolver', () => {
  describe('#saveAccessToken()', () => {
    const resolver = SignInMutationResolver.create()

    describe('when saving access token', () => {
      const saveTokenCases = [
        {
          name: 'new access token',
          params: {
            adminId: 50001,
            context: {
              now: new Date('2024-04-10T00:00:00Z'),
            },
          },
          expected: {
            token: 'token_super_valid',
          },
        },
      ]

      test.each(saveTokenCases)('should save access token for $name', async ({
        params,
        expected,
      }) => {
        const mockCallback = jest.fn()
          .mockResolvedValue(AdminAccessToken.build({
            token: expected.token,
          }))

        jest.spyOn(resolver, 'generateTransactionCallback')
          .mockReturnValue(mockCallback)

        const result = await resolver.saveAccessToken(params)

        expect(result)
          .toHaveProperty('token', expected.token)
      })
    })
  })
})

describe('SignInMutationResolver', () => {
  describe('#generateTransactionCallback', () => {
    const resolver = SignInMutationResolver.create()

    describe('when generating callback', () => {
      const callbackCases = [
        {
          params: {
            adminId: 50001,
            now: new Date('2024-04-10T00:00:00Z'),
          },
        },
      ]

      test.each(callbackCases)('should generate valid callback', async ({
        params,
      }) => {
        const callback = resolver.generateTransactionCallback(params)

        expect(callback)
          .toBeInstanceOf(Function)
      })
    })
  })
})

describe('SignInMutationResolver', () => {
  describe('#formatResponse', () => {
    const resolver = SignInMutationResolver.create()

    describe('when formatting response', () => {
      const formatCases = [
        {
          params: {
            accessTokenEntity: AdminAccessToken.build({
              token: 'token_super_valid',
            }),
          },
          expected: {
            accessToken: 'token_super_valid',
          },
        },
        {
          params: {
            accessTokenEntity: AdminAccessToken.build({
              token: 'token_content_valid',
            }),
          },
          expected: {
            accessToken: 'token_content_valid',
          },
        },
      ]

      test.each(formatCases)('should format response correctly', ({
        params,
        expected,
      }) => {
        const result = resolver.formatResponse(params)

        expect(result)
          .toEqual(expected)
      })
    })
  })
})

describe('SignInMutationResolver', () => {
  describe('#schema', () => {
    test('should return correct schema name', () => {
      const resolver = SignInMutationResolver.create()

      expect(resolver.schema)
        .toBe('signIn')
    })
  })
})
