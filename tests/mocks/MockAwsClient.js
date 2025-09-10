import {
  PutObjectCommand,
} from '@aws-sdk/client-s3'

const putObjectMockResult = {
  $metadata: {
    httpStatusCode: 200,
    requestId: undefined,
    extendedRequestId: 'FYDpO+s0hu+wQdeJcXrRuyA84bGjMEUcmgvvbLp3Gsk+iaZxHr8JtcnWprcwa4pA/ZKDfuJheXE=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0,
  },
  BucketKeyEnabled: undefined,
  ChecksumCRC32: undefined,
  ChecksumCRC32C: undefined,
  ChecksumSHA1: undefined,
  ChecksumSHA256: undefined,
  ETag: '"451599a5f9afa91a0f2097040a796f3d"',
  Expiration: undefined,
  RequestCharged: undefined,
  SSECustomerAlgorithm: undefined,
  SSECustomerKeyMD5: undefined,
  SSEKMSEncryptionContext: undefined,
  SSEKMSKeyId: undefined,
  ServerSideEncryption: undefined,
  VersionId: undefined,
}

export default class MockAwsClient {
  /**
   * constructor
   *
   * @param {*} params
   */
  constructor ({
    credentials,
    region,
  }) {
    this.credentials = credentials
    this.region = region
  }

  /**
   * mock send function
   *
   * @param {*} command
   * @returns {Promise<*>}
   */
  async send (command) {
    if (command instanceof PutObjectCommand) {
      return putObjectMockResult
    }

    throw new Error('Unsupported command type')
  }
}
