import '../../../../../../sequelize/_.js'

import AdminAccessToken from '../../../../../../sequelize/models/AdminAccessToken.js'
import AdminPasswordHash from '../../../../../../sequelize/models/AdminPasswordHash.js'
import SignInMutationResolver from '../../../../../../server/graphql/resolvers/admin/actual/mutations/SignInMutationResolver.js'

describe('SignInMutationResolver', () => {
  describe('#resolve()', () => {
    const resolver = SignInMutationResolver.create()

    describe('when credentials are valid', () => {
      const successCases = [
        {
          name: 'super admin login',
          input: {
            email: 'super.admin@example.com',
            password: 'pAsswOrd$01',
          },
          mockContext: {
            now: new Date('2024-04-10T00:00:00Z'),
          },
          expected: {
            accessToken: 'token_super_valid',
          },
        },
        {
          name: 'content admin login',
          input: {
            email: 'content.admin@example.com',
            password: 'pAsswOrd$01',
          },
          mockContext: {
            now: new Date('2024-04-10T00:00:00Z'),
          },
          expected: {
            accessToken: 'token_content_valid',
          },
        },
      ]

      test.each(successCases)('should successfully sign in for $name', async ({
        input,
        mockContext,
        expected,
      }) => {
        jest.spyOn(resolver, 'saveAccessToken')
          .mockResolvedValue(AdminAccessToken.build({
            token: expected.accessToken,
          }))

        const result = await resolver.resolve({
          variables: {
            input,
          },
          context: mockContext,
        })

        expect(result)
          .toEqual(expected)
      })
    })

    describe('when email is not found', () => {
      const invalidEmailCases = [
        {
          name: 'non-existent email',
          input: {
            email: 'nonexistent@example.com',
            password: 'password123',
          },
        },
        {
          name: 'malformed email',
          input: {
            email: 'invalid.email',
            password: 'password123',
          },
        },
      ]

      test.each(invalidEmailCases)('should throw IncorrectSecret error for $name', async ({
        input,
      }) => {
        jest.spyOn(resolver, 'findPasswordHashByEmail')
          .mockResolvedValue(null)

        await expect(resolver.resolve({
          variables: {
            input,
          },
          context: {},
        }))
          .rejects
          .toThrow('202.M002.001')
      })
    })

    describe('when password is incorrect', () => {
      const invalidPasswordCases = [
        {
          name: 'wrong password',
          input: {
            email: 'super.admin@example.com',
            password: 'wrongpassword',
          },
        },
        {
          name: 'empty password',
          input: {
            email: 'super.admin@example.com',
            password: '',
          },
        },
      ]

      test.each(invalidPasswordCases)('should throw IncorrectSecret error for $name', async ({
        input,
      }) => {
        const passwordHashEntity = AdminPasswordHash.build({
          AdminId: 50001,
          verifyPassword: jest.fn()
            .mockResolvedValue(false),
        })

        jest.spyOn(resolver, 'findPasswordHashByEmail')
          .mockResolvedValue(passwordHashEntity)

        await expect(resolver.resolve({
          variables: {
            input,
          },
          context: {},
        }))
          .rejects
          .toThrow('202.M002.001')
      })
    })
  })
})
