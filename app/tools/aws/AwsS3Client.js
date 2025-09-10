import {
  S3Client,
} from '@aws-sdk/client-s3'

import AwsS3ClientConfig from './AwsS3ClientConfig.js'
import AwsS3FileUploadResult from './AwsS3FileUploadResult.js'

/**
 * @link
 * https://www.npmjs.com/package/@aws-sdk/client-s3
 */
export default class AwsS3Client {
  /**
   * constructor
   *
   * @param {AwsS3ClientInstanceParams} params
   */
  constructor ({
    awsS3ClientConfig = AwsS3ClientConfig.create(),
    AwsS3ClientOriginalClass = S3Client,
  } = {}) {
    this.config = awsS3ClientConfig.config
    this.awsS3Client = new AwsS3ClientOriginalClass(this.config)
  }

  /**
   * create instance of AwsS3Client
   *
   * @param {AwsS3ClientInstanceParams} params
   * @returns {AwsS3Client} - Instance of this class.
   */
  static create (params = {}) {
    return new this(params)
  }

  /**
   * upload file to s3
   *
   * @param {import('./AwsS3FileUploadPayload.js')} payload
   * @returns {Promise<import('./AwsS3FileUploadResult.js')>}
   */
  async uploadFileToS3 (payload) {
    return this.awsS3Client
      .send(payload.buildParams())
      .then(rawResult => AwsS3FileUploadResult.create({
        payload,
        rawResult,
      }))
      .catch(error => AwsS3FileUploadResult.create({
        payload,
        error,
      }))
  }
}

/**
 * @typedef {{
 *   awsS3ClientConfig?: AwsS3ClientConfig.AwsS3ClientConfigInstance,
 *   AwsS3ClientOriginalClass?: typeof S3Client
 * }} AwsS3ClientInstanceParams
 */

/**
 * @typedef {{
 *   '$metadata': {
 *     httpStatusCode?: number,
 *     requestId?: string,
 *     extendedRequestId?: string,
 *     cfId?: string,
 *     attempts?: number,
 *     totalRetryDelay?: number
 *   },
 *   BucketKeyEnabled?: boolean,
 *   ChecksumCRC32?: string,
 *   ChecksumCRC32C?: string,
 *   ChecksumSHA1?: string,
 *   ChecksumSHA256?: string,
 *   ETag?: string,
 *   Expiration?: string,
 *   RequestCharged?: string,
 *   SSECustomerAlgorithm?: string,
 *   SSECustomerKeyMD5?: string,
 *   SSEKMSEncryptionContext?: string,
 *   SSEKMSKeyId?: string,
 *   ServerSideEncryption?: string,
 *   VersionId?: string
 * }} AwsS3ClientUploadResult
 */
