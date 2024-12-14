import {
  BaseQueryResolver,
} from '@openreachtech/renchan'

export default class UploadThumbnailMutationResolver extends BaseQueryResolver {
  /** @override */
  static get schema () {
    return 'uploadThumbnail'
  }

  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // Upload Related Errors
      UploadFailed: '205.M004.001',
      InvalidFileExtension: '203.M004.002',
      FileTooLarge: '203.M004.003',

      // Validation Errors
      InvalidInput: '203.M004.004',
      InvalidImageFormat: '203.M004.005',

      // Storage Errors
      StorageWriteFailed: '201.M004.006',
      URLGenerationFailed: '201.M004.007',
    }
  }
}
