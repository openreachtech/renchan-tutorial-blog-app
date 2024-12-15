export {}

declare global {
  namespace server.graphql.context {
    interface AdminContext {
      admin: model.Admin
    }

    interface CustomerContext {
      customer: model.Customer
    }
  }
}
