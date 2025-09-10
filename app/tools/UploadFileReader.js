import { Buffer } from 'buffer'

/**
 * Response for read upload handler.
 */
export default class UploadFileReader {
  /**
   * Read from upload handler.
   *
   * @param {import('graphql-upload').Upload} upload - Upload Instance.
   * @returns {Promise<UploadReadResult>} - Read result.
   */
  static async readFile (upload) {
    // Upload class resolves a file
    await upload.promise

    if (!upload.file) {
      throw new Error('File does not exist.')
    }

    return {
      file: upload.file,
      content: await this.readContent(upload.file.createReadStream()),
    }
  }

  /**
   * Read content
   *
   * @param {object} stream
   * @returns {Promise<Buffer>}
   */
  static async readContent (stream) {
    return new Promise((resolve, reject) => {
      const data = []
      stream
        .on('data', chunk => {
          data.push(chunk)
        })
        .on('end', () => resolve(Buffer.concat(data)))
        .on('error', reject)
    })
  }
}

/**
 * @typedef {{
 *   file: import('graphql-upload').FileUpload,
 *   content: Buffer,
 * }} UploadReadResult
 */
