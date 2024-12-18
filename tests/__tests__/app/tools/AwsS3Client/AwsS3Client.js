import AwsS3Client from '../../../../../app/tools/aws/AwsS3Client'
import AwsS3ClientPayload from '../../../../../app/tools/aws/AwsS3FileUploadPayload.js'
import AwsS3ClientConfig from '../../../../../app/tools/aws/AwsS3ClientConfig.js'

import MockAwsClient from '../../../../../tests/mocks/MockAwsClient.js'

describe('AwsS3Client', () => {
  const mockInstanceParams = {
    secretAccessKey: 'abcdefg123456',
    accessKeyId: '123456abcdef',
    region: 'ap-south-1',
  }

  const mockPayload = {
    bucketName: 'test-aws-bucket-name',
    filePath: '/test/file/path.jpeg',
    fileBody: '0001111222',
    contentType: 'image/jpeg',
  }

  const awsS3ClientPayloadWithMock = AwsS3ClientPayload.create(mockPayload)

  describe('.create()', () => {
    test(`params: ${mockInstanceParams}`, () => {
      const actual = AwsS3Client.create({
        awsS3ClientConfig: AwsS3ClientConfig.create(mockInstanceParams),
        AwsS3ClientOriginalClass: /** @type {*} */ (MockAwsClient),
      })

      expect(actual)
        .toBeInstanceOf(AwsS3Client)
    })
  })

  describe('#uploadFileToS3()', () => {
    const expected = {
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

    test(`params: ${mockPayload}`, async () => {
      const awsClient = AwsS3Client.create({
        awsS3ClientConfig: AwsS3ClientConfig.create(mockInstanceParams),
        AwsS3ClientOriginalClass: /** @type {*} */ (MockAwsClient),
      })
      const actual = await awsClient.uploadFileToS3(awsS3ClientPayloadWithMock)

      expect(actual.rawResult)
        .toEqual(expected)

      expect(actual.payload)
        .toEqual({
          bucketName: 'test-aws-bucket-name',
          filePath: '/test/file/path.jpeg',
          fileBody: '0001111222',
          contentType: 'image/jpeg',
        })

      expect(actual.isSuccess)
        .toBe(true)
      expect(actual.isFailure)
        .toBe(false)
    })
  })
})
