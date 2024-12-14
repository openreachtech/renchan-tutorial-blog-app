import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class SignInMutationResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'signIn'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // Validation Errors
      InvalidInput: '203.M002.001',
      InvalidEmail: '203.M002.002',
      InvalidPassword: '203.M002.003',

      // Authentication Errors
      InvalidCredentials: '202.M002.004',
      AccountLocked: '202.M002.005',

      // Token Generation Errors
      TokenGenerationFailed: '201.M002.006',
    }
  }
}
