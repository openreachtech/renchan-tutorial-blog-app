import { jest } from '@jest/globals'
import CustomerQueryByIdResolver from '../../../../../../../../server/graphql/resolvers/customer/actual/queries/CustomerQueryByIdResolver.js'
import CustomerQueryResolver from '../../../../../../../../server/graphql/resolvers/customer/actual/queries/CustomerQueryResolver.js'

describe('CustomerQueryByIdResolver', () => {
  describe('.get:schema', () => {
    test('to be fixed value', () => {
      const actual = CustomerQueryByIdResolver.schema

      expect(actual)
        .toBe('customerById')
    })
  })
})

describe('CustomerQueryByIdResolver', () => {
  describe('#resolve()', () => {
    beforeEach(() => {
      jest.spyOn(CustomerQueryResolver, 'findCustomerDetail').mockClear()
      jest.spyOn(CustomerQueryResolver, 'formatCustomerDetail').mockClear()
    })

    describe('with existing customer id', () => {
      const cases = [
        {
          params: {
            variables: { id: 100001 },
          },
          mockCustomer: {
            id: 100001,
            registeredAt: new Date('2024-01-01T00:00:01.001Z'),
            CustomerBasic: {
              username: 'customerName01',
            },
            CustomerSecret: {
              email: 'customer.100001@example.com',
            },
          },
          expected: {
            id: 100001,
            username: 'customerName01',
            email: 'customer.100001@example.com',
            registeredAt: new Date('2024-01-01T00:00:01.001Z'),
          },
        },
        {
          params: {
            variables: { id: 100002 },
          },
          mockCustomer: {
            id: 100002,
            registeredAt: new Date('2024-01-02T00:00:02.002Z'),
            CustomerBasic: {
              username: 'customerName02',
            },
            CustomerSecret: {
              email: 'customer.100002@example.com',
            },
          },
          expected: {
            id: 100002,
            username: 'customerName02',
            email: 'customer.100002@example.com',
            registeredAt: new Date('2024-01-02T00:00:02.002Z'),
          },
        },
      ]

      test.each(cases)('id: $params.variables.id', async ({ params, mockCustomer, expected }) => {
        // jest.spyOn(CustomerQueryResolver, 'findCustomerDetail').mockResolvedValue(Promise.resolve(mockCustomer))
        // jest.spyOn(CustomerQueryResolver, 'formatCustomerDetail').mockReturnValue(Promise.resolve(expected))

        const resolver = new CustomerQueryByIdResolver()
        const actual = await resolver.resolve(params)

        // expect(CustomerQueryResolver.findCustomerDetail).toHaveBeenCalledWith(params.variables.id)
        // expect(CustomerQueryResolver.formatCustomerDetail).toHaveBeenCalledWith(mockCustomer)
        expect(actual).toEqual(expected)
      })
    })

    describe('with non-existing customer id', () => {
      const cases = [
        {
          params: {
            variables: { id: 999998 },
          },
        },
        {
          params: {
            variables: { id: 999999 },
          },
        },
      ]

      test.each(cases)('id: $params.variables.id', async ({ params }) => {
        jest.spyOn(CustomerQueryResolver, 'findCustomerDetail').mockResolvedValue(null)
        jest.spyOn(CustomerQueryResolver, 'formatCustomerDetail').mockReturnValue(null)

        const resolver = new CustomerQueryByIdResolver()
        const actual = await resolver.resolve(params)

        expect(CustomerQueryResolver.findCustomerDetail).toHaveBeenCalledWith(params.variables.id)
        expect(CustomerQueryResolver.formatCustomerDetail).toHaveBeenCalledWith(null)
        expect(actual).toBeNull()
      })
    })
  })
})