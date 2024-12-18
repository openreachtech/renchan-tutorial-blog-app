import {
  PutObjectCommand,
} from '@aws-sdk/client-s3'

import AwsS3FileUploadPayload from '../../../../../app/tools/aws/AwsS3FileUploadPayload.js'

describe('AwsS3FileUploadPayload', () => {
  describe('.create()', () => {
    const tables = [
      {
        bucketName: 'test-bucket',
        filePath: '/test/filepath.jpg',
        fileBody: 'abasdfewavaa1234t23vassas',
        contentType: 'image/jpg',
      },
    ]

    test.each(tables)('params: $params.bucketName', params => {
      const actual = AwsS3FileUploadPayload.create(params)

      expect(actual)
        .toBeInstanceOf(AwsS3FileUploadPayload)
    })
  })

  describe('#buildParams()', () => {
    const tables = [
      {
        params: {
          bucketName: 'test-bucket',
          filePath: '/test/filepath.jpg',
          fileBody: 'abasdfewavaa1234t23vassas',
          contentType: 'image/jpg',
        },
        expected: {
          Bucket: 'test-bucket',
          Key: '/test/filepath.jpg',
          Body: 'abasdfewavaa1234t23vassas',
          ContentType: 'image/jpg',
        },
      },
    ]

    test.each(tables)('params: $params.bucketName', ({
      params,
      expected,
    }) => {
      const instance = AwsS3FileUploadPayload.create(params)
      const actual = instance.buildParams()

      expect(actual)
        .toBeInstanceOf(PutObjectCommand)
      expect(actual.input)
        .toEqual(expected)
    })
  })
})
