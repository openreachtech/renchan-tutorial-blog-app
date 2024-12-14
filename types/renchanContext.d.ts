export {}

declare global {
  namespace renchanMiddleware {
    interface AdminContext {
      admin: model.Admin
    }

    interface CustomerContext {
      customer: model.Customer
    }
  }
}
