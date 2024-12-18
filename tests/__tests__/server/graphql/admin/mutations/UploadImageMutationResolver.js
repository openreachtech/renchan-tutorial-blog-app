import {
  Buffer,
} from 'buffer'

import '../../../../../../sequelize/_.js'

import AwsS3Client from '../../../../../../app/tools/aws/AwsS3Client.js'
import AwsS3FileUploadPayload from '../../../../../../app/tools/aws/AwsS3FileUploadPayload.js'

import UploadImageMutationResolver from '../../../../../../server/graphql/resolvers/admin/actual/mutations/UploadThumbnailMutationResolver.js'

const mockFileStream = {
  on: (key, callback) => {
    if (key === 'data') {
      const chunk = Buffer.from('chunk')
      callback(chunk)
    } else {
      callback()
    }

    return mockFileStream
  },
}

describe('UploadImageMutationResolver', () => {
  describe('#resolve()', () => {
    describe('Upload file should be image', () => {
      const cases = [
        {
          params: {
            input: {
              image: {
                file: {
                  mimetype: 'image/pdf',
                  filename: 'test.pdf',
                  createReadStream: () => mockFileStream,
                },
              },
            },
          },
          mockContext: {},
        },
      ]

      test.each(cases)(
        'mimetype: $input.newImage.file.mimetype',
        async ({
          params,
          mockContext,
        }) => {
          const resolver = UploadImageMutationResolver.create()

          await expect(resolver.resolve(
            params,
            mockContext
          ))
            .rejects
            .toThrow('203.M004.002')
        }
      )
    })

    describe('Upload file failed', () => {
      const cases = [
        {
          params: {
            input: {
              image: {
                file: {
                  mimetype: 'image/png',
                  filename: 'test.png',
                  createReadStream: () => mockFileStream,
                },
              },
            },
          },
          mockContext: {},
          mockFileName: '1698751353999',
          expectedUploadFileToAWSParams: {
            contentType: 'image/png',
            filePath: '/image/1698751353999.png', // 1698751353999 = currentDateTime.getTime()
            fileBody: expect.any(Buffer),
          },
        },
      ]

      test.each(cases)(
        'mimetype: $params.input.newImage.file.mimetype',
        async ({
          params,
          mockContext,
          mockFileName,
          expectedUploadFileToAWSParams,
        }) => {
          const resolver = UploadImageMutationResolver.create()
          const generateFileNameSpy = jest.spyOn(resolver, 'generateFileName')
            .mockReturnValue(mockFileName)
          const mockUploadFileToAWSSpy = jest.spyOn(resolver, 'uploadFileToAWS')
            .mockResolvedValue({
              isFailure: true,
            })

          await expect(resolver.resolve(
            {
              variables: params,
            },
            mockContext
          ))
            .rejects
            .toThrow('205.M004.003')

          expect(mockUploadFileToAWSSpy)
            .toHaveBeenCalledWith(expectedUploadFileToAWSParams)

          mockUploadFileToAWSSpy.mockRestore()
          generateFileNameSpy.mockRestore()
        }
      )
    })

    describe('upload image successfully', () => {
      const cases = [
        {
          params: {
            input: {
              image: {
                file: {
                  mimetype: 'image/png',
                  filename: 'test.png',
                  createReadStream: () => mockFileStream,
                },
              },
            },
          },
          mockEnv: {
            AWS_S3_DOMAIN: 'https://test.s3.amazonaws.com',
          },
          mockContext: {},
          mockDate: new Date(1577836800000),
          expectedHash: {
            uploadFileToAWSParams: {
              contentType: 'image/png',
              fileBody: expect.any(Buffer),
              filePath: '/image/1577836800000.jpg',
            },
          },
        },
      ]

      test.each(cases)(
        'filename: $params.input.image.file.filename',
        async ({
          params,
          mockEnv,
          mockContext,
          expectedHash,
          mockDate,
        }) => {
          const uploadFileToAWS = {
            success: true,
          }
          const mockComposeS3Path = '/image/1577836800000.jpg'
          const mockGenerateImageUrl = 'https://test.s3.amazonaws.com/image/1577836800000.jpg'

          const resolver = UploadImageMutationResolver.create({
            processEnv: mockEnv,
          })

          const nowSpy = jest.spyOn(resolver, 'now', 'get')
            .mockReturnValue(mockDate)

          const composeS3PathSpy = jest.spyOn(resolver, 'composeS3Path')
            .mockReturnValue(mockComposeS3Path)
          const uploadFileToAWSSpy = jest.spyOn(resolver, 'uploadFileToAWS')
            .mockResolvedValue(uploadFileToAWS)

          const actual = await resolver.resolve(
            {
              variables: params,
            },
            mockContext
          )

          expect(actual)
            .toEqual({
              url: mockGenerateImageUrl,
            })
          expect(composeS3PathSpy)
            .toHaveBeenCalledWith({
              filename: params.input.image.file.filename,
            })
          expect(uploadFileToAWSSpy)
            .toHaveBeenCalledWith(expectedHash.uploadFileToAWSParams)

          nowSpy.mockRestore()
          composeS3PathSpy.mockRestore()
          uploadFileToAWSSpy.mockRestore()
        }
      )
    })
  })

  describe('#isImage()', () => {
    const cases = [
      {
        file: {
          createReadStream: () => Buffer.from('test-true'),
          mimetype: 'image/png',
          filename: 'test.png',
        },
        expected: true,
      },
      {
        file: {
          createReadStream: () => Buffer.from('test-false'),
          mimetype: 'image/pdf',
          filename: 'test.pdf',
        },
        expected: false,
      },
    ]

    test.each(cases)(
      'filename: $file.filename',
      ({
        file,
        expected,
      }) => {
        const resolver = UploadImageMutationResolver.create()

        const actual = resolver.isImage(file.mimetype)

        expect(actual)
          .toEqual(expected)
      }
    )
  })

  describe('#composeS3Path()', () => {
    const cases = [
      {
        params: {
          filename: 'test1.jpg',
        },
        mockFileName: '1656543600000',
        expected: '/image/1656543600000.jpg',
      },
      {
        params: {
          filename: 'test2.jpg',
        },
        mockFileName: 'mock-file-name',
        expected: '/image/mock-file-name.jpg',
      },
    ]

    test.each(cases)(
      'filename: $params.filename',
      ({
        params,
        mockFileName,
        expected,
      }) => {
        const resolver = UploadImageMutationResolver.create()

        const generateFileNameSpy = jest.spyOn(resolver, 'generateFileName')
          .mockReturnValue(mockFileName)

        const actual = resolver.composeS3Path(params)

        expect(actual)
          .toEqual(expected)

        generateFileNameSpy.mockRestore()
      }
    )
  })

  describe('#generateFileName()', () => {
    const cases = [
      {
        params: {
          fileNameLength: 32,
        },
      },
      {
        params: {
          fileNameLength: 16,
        },
      },
    ]

    test.each(cases)('fileNameLength: $params.fileNameLength', ({
      params,
    }) => {
      const resolver = UploadImageMutationResolver.create()

      const actual = resolver.generateFileName(params)

      expect(actual)
        .toHaveLength(params.fileNameLength)
    })
  })

  describe('#getFileExtension()', () => {
    const cases = [
      {
        fileName: 'affiliate-2001.jpg',
        expected: 'jpg',
      },
      {
        fileName: 'affiliate-2002.png',
        expected: 'png',
      },
    ]
    test.each(cases)(
      'fileName: $fileName',
      async ({
        fileName,
        expected,
      }) => {
        const resolver = UploadImageMutationResolver.create()

        const actual = resolver.getFileExtension(fileName)

        expect(actual)
          .toEqual(expected)
      }
    )
  })

  describe('#uploadFileToAWS()', () => {
    const cases = [
      {
        params: {
          filePath: 'test-file-path',
          contentType: 'test-content-type',
          fileBody: Buffer.from('test-file-body'),
        },
        mockUploadFileToS3: {
          success: true,
        },
        mockEnv: {
          AWS_S3_BUCKET: 'test-bucket',
        },
      },
    ]

    test.each(cases)(
      'filePath: $params.filePath',
      async ({
        params,
        mockUploadFileToS3,
        mockEnv,
      }) => {
        const awsS3FileUploadPayload = await AwsS3FileUploadPayload.create({
          bucketName: 'test-bucket',
          contentType: 'test-content-type',
          fileBody: expect.any(Buffer),
          filePath: 'test-file-path',
        })

        const awsS3Client = AwsS3Client.create()
        const uploadFileToS3Spy = jest.spyOn(awsS3Client, 'uploadFileToS3')
          .mockResolvedValue(mockUploadFileToS3)

        const resolver = UploadImageMutationResolver.create({
          awsClient: awsS3Client,
          processEnv: mockEnv,
        })

        const actual = await resolver.uploadFileToAWS(params)

        expect(actual)
          .toEqual(mockUploadFileToS3)
        expect(uploadFileToS3Spy)
          .toHaveBeenCalledWith(awsS3FileUploadPayload)

        uploadFileToS3Spy.mockRestore()
      }
    )
  })

  describe('#get:schema', () => {
    test('should return "uploadThumbnail"', () => {
      const actual = UploadImageMutationResolver.create().schema

      expect(actual)
        .toBe('uploadThumbnail')
    })
  })
})
