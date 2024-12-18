import {
  Buffer,
} from 'buffer'
import UploadFileReader from '../../../../app/tools/UploadFileReader.js'

describe('UploadFileReader', () => {
  describe('.readFile()', () => {
    const cases = [
      {
        upload: {
          file: {
            filename: 'image (4).png',
            mimetype: 'image/png',
            encoding: '7bit',
            createReadStream: () => {},
          },
        },
        expected: {
          file: {
            filename: 'image (4).png',
            mimetype: 'image/png',
            encoding: '7bit',
            createReadStream: () => {},
          },
          content: Buffer.from('test'),
        },
      },
    ]

    test.each(cases)(
      'upload: $upload.file',
      async ({
        upload,
        expected,
      }) => {
        const readContentSpy = jest.spyOn(UploadFileReader, 'readContent')
          .mockResolvedValue(Buffer.from('test'))

        const actual = await UploadFileReader.readFile(upload)

        expect(JSON.stringify(actual))
          .toEqual(JSON.stringify(expected))
        expect(readContentSpy)
          .toHaveBeenCalledWith(upload.file.createReadStream())

        readContentSpy.mockRestore()
      }
    )

    describe('throw error', () => {
      const cases = [
        {
          upload: {
            file: null,
          },
          expected: new Error('File does not exist.'),
        },
      ]

      test.each(cases)(
        'upload: $upload.file',
        async ({
          upload,
          expected,
        }) => {
          await expect(UploadFileReader.readFile(upload))
            .rejects
            .toThrow(expected)
        }
      )
    })
  })
})

describe('UploadFileReader', () => {
  describe('.readContent()', () => {
    const cases = [
      {
        expected: Buffer.from('test read content'),
      },
    ]

    test.each(cases)(
      'expected: $expected',
      async ({
        expected,
      }) => {
        const stream = {
          createReadStream: () => {},
        }
        const readContentSpy = jest.spyOn(UploadFileReader, 'readContent')
          .mockResolvedValue(Buffer.from('test read content'))

        const actual = await UploadFileReader.readContent(stream)

        expect(actual)
          .toEqual(expected)
        expect(readContentSpy)
          .toHaveBeenCalledWith(stream)

        readContentSpy.mockRestore()
      }
    )
  })
})
