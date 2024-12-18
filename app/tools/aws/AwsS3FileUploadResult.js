import AwsS3OperationResult from './AwsS3OperationResult.js'

/**
 * Wrapper of file upload result.
 *
 * @extends AwsS3OperationResult<import('./AwsS3FileUploadPayload.js'),import('@aws-sdk/client-s3/dist-types/commands').PutObjectCommandOutput>
 */
export default class AwsS3FileUploadResult extends AwsS3OperationResult {
  /**
   * Create the instance of this class.
   *
   * @param {{
   *   payload: import('./AwsS3FileUploadPayload.js'),
   *   rawResult?: import('@aws-sdk/client-s3').ServiceOutputTypes?,
   *   error?: Error?
   * }} params
   * @returns {AwsS3FileUploadResult} - Instance of this class.
   */
  static create (params) {
    return new this(params)
  }
}

/**
 * @typedef {{
 *   rawResult: import('@aws-sdk/client-s3').ServiceOutputTypes?,
 *   payload: import('./AwsS3FileUploadPayload.js'),
 *   error: Error?
 * }} AwsS3FileUploadResultInitParams
 */
