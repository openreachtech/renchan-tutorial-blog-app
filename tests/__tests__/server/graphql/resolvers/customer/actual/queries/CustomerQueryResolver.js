import CustomerQueryResolver from '../../../../../../../../server/graphql/resolvers/customer/actual/queries/CustomerQueryResolver.js'
import Customer from '../../../../../../../../sequelize/models/Customer.js'
import CustomerBasic from '../../../../../../../../sequelize/models/CustomerBasic.js'
import CustomerSecret from '../../../../../../../../sequelize/models/CustomerSecret.js'

describe('CustomerQueryResolver', () => {
  describe('.get:schema', () => {
    test('to be fixed value', () => {
      const actual = CustomerQueryResolver.schema

      expect(actual)
        .toBe('customer')
    })
  })
})

describe('CustomerQueryResolver', () => {
  describe('#findCustomerDetail()', () => {
    describe('with existing customer id', () => {
      const cases = [
        {
          params: {
            id: 100001,
          },
          expected: {
            id: 100001,
            registeredAt: new Date('2024-01-01T00:00:01.001Z'),
            CustomerBasic: {
              username: 'customerName01',
            },
            CustomerSecret: {
              email: 'customer.100001@example.com',
            },
          },
        },
        {
          params: {
            id: 100002,
          },
          expected: {
            id: 100002,
            registeredAt: new Date('2024-01-02T00:00:02.002Z'),
            CustomerBasic: {
              username: 'customerName02',
            },
            CustomerSecret: {
              email: 'customer.100002@example.com',
            },
          },
        },
      ]

      test.each(cases)('id: $params.id', async ({ params, expected }) => {
        const actual = await CustomerQueryResolver.findCustomerDetail(params.id)

        expect(actual).toBeDefined()
        expect(actual.id).toBe(expected.id)
        expect(actual.registeredAt).toEqual(expected.registeredAt)
        expect(actual.CustomerBasic).toBeDefined()
        expect(actual.CustomerBasic.username).toBe(expected.CustomerBasic.username)
        expect(actual.CustomerSecret).toBeDefined()
        expect(actual.CustomerSecret.email).toBe(expected.CustomerSecret.email)
      })
    })

    describe('with non-existing customer id', () => {
      const cases = [
        {
          params: {
            id: 999998,
          },
        },
        {
          params: {
            id: 999999,
          },
        },
      ]

      test.each(cases)('id: $params.id', async ({ params }) => {
        const actual = await CustomerQueryResolver.findCustomerDetail(params.id)

        expect(actual)
          .toBeNull()
      })
    })
  })
})

describe('CustomerQueryResolver', () => {
  describe('#formatCustomerDetail()', () => {
    const cases = [
      {
        params: {
          customerDetail: {
            id: 100001,
            registeredAt: new Date('2024-01-01T00:00:01.001Z'),
            CustomerBasic: {
              username: 'customerName01',
            },
            CustomerSecret: {
              email: 'customer.100001@example.com',
            },
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
          customerDetail: {
            id: 100002,
            registeredAt: new Date('2024-01-02T00:00:02.002Z'),
            CustomerBasic: {
              username: 'customerName02',
            },
            CustomerSecret: {
              email: 'customer.100002@example.com',
            },
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

    test.each(cases)('id: $params.customerDetail.id', async ({ params, expected }) => {
      const actual = await CustomerQueryResolver.formatCustomerDetail(params.customerDetail)

      expect(actual)
        .toEqual(expected)
    })
  })
})