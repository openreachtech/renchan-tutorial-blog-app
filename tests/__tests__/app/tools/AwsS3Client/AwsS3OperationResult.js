import AwsS3OperationResult from '../../../../../app/tools/aws/AwsS3OperationResult'

const payload = {
  bucketName: 'test-aws-bucket-name',
  filePath: '/test/file/path.jpeg',
  fileBody: '0001111222',
  contentType: 'image/jpeg',
}

const rawResult = {
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

describe('AwsS3OperationResult', () => {
  test('normal', () => {
    const result = AwsS3OperationResult.create({
      payload,
      rawResult,
    })

    expect(result.isSuccess)
      .toBeTruthy()
    expect(result.isFailure)
      .toBeFalsy()

    expect(result.payload)
      .toEqual(payload)

    expect(result.rawResult)
      .toEqual(rawResult)
    expect(result.error)
      .toBeNull()
  })
})

describe('AwsS3OperationResult', () => {
  test('error', () => {
    const error = new Error('The AWS Access Key Id you provided does not exist in our records.')
    const result = AwsS3OperationResult.create({
      payload,
      error,
    })

    expect(result.isSuccess)
      .toBeFalsy()
    expect(result.isFailure)
      .toBeTruthy()

    expect(result.payload)
      .toEqual(payload)

    expect(result.rawResult)
      .toBeNull()
    expect(result.error)
      .toEqual(error)
  })
})
