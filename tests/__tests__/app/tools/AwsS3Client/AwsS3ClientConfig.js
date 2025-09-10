import AwsS3ClientConfig from '../../../../../app/tools/aws/AwsS3ClientConfig.js'

describe('AwsS3ClientConfig', () => {
  const mockConfig = {
    secretAccessKey: 'aws-secret-access-key',
    accessKeyId: 'access-key-id',
    region: 'ap-south-1',
  }

  test('.create()', () => {
    const awsClientConfig = AwsS3ClientConfig.create(mockConfig)

    expect(awsClientConfig)
      .toBeInstanceOf(AwsS3ClientConfig)
  })

  describe('#get:config', () => {
    describe('with params', () => {
      const mockConfig = {
        secretAccessKey: 'aws-secret-access-key',
        accessKeyId: 'access-key-id',
        region: 'ap-south-1',
      }

      const expected = {
        credentials: {
          secretAccessKey: 'aws-secret-access-key',
          accessKeyId: 'access-key-id',
        },
        region: 'ap-south-1',
      }

      test(`config: ${mockConfig}`, () => {
        const awsS3Client = new AwsS3ClientConfig(mockConfig)

        expect(awsS3Client.config)
          .toEqual(expected)
      })
    })

    describe('with no params', () => {
      const expected = {
        credentials: {
          secretAccessKey: 'aws_secret_access_key_test',
          accessKeyId: 'aws_access_key',
        },
        region: 'ap-south-1',
      }
      test('env params', () => {
        const awsS3Client = AwsS3ClientConfig.create()

        expect(awsS3Client.config)
          .toEqual(expected)
      })
    })
  })
})
