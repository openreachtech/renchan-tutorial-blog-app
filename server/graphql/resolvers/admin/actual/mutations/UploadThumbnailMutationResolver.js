import {
  URL,
} from 'url'
import {
  BaseMutationResolver,
} from '@openreachtech/renchan'
import {
  RandomTextGenerator,
} from '@openreachtech/renchan-tools'
import {
  EnvironmentFacade,
} from '@openreachtech/renchan-env'

import UploadFileReader from '../../../../../../app/tools/UploadFileReader.js'
import AwsS3Client from '../../../../../../app/tools/aws/AwsS3Client.js'
import AwsS3ClientConfig from '../../../../../../app/tools/aws/AwsS3ClientConfig.js'
import AwsS3FileUploadPayload from '../../../../../../app/tools/aws/AwsS3FileUploadPayload.js'

const env = EnvironmentFacade.create()
  .generateFacade()

export default class UploadImageMutationResolver extends BaseMutationResolver {
  /** @override */
  static get errorCodeHash () {
    return {
      ...super.errorCodeHash,

      // Basic input validation
      InvalidInput: '203.M004.001',

      // Specific input validations
      InvalidImageFormat: '203.M004.002',

      // Upload specific errors
      UploadFailed: '205.M004.003',
      InvalidFileExtension: '203.M004.004',
      FileSizeTooLarge: '203.M004.005',

      // Storage/Processing errors
      ImageProcessingFailed: '205.M004.006',
      StorageWriteFailed: '205.M004.007',

      // Response validation
      FailedToGenerateUrl: '205.M004.008',
    }
  }

  /**
   * constructor
   *
   * @param {UploadImageMutationResolverConstructorParams} param
   */
  constructor ({
    awsClient,
    processEnv,
    randomTextGenerator,
    ...params
  } = {}) {
    super(params)

    this.awsClient = awsClient
    this.processEnv = processEnv
    this.randomTextGenerator = randomTextGenerator
  }

  /**
   * Create new instance
   *
   * @param {UploadImageMutationResolverParams} params
   * @returns {UploadImageMutationResolver}
   */
  static create ({
    awsClient = AwsS3Client.create({
      awsS3ClientConfig: new AwsS3ClientConfig(),
    }),
    processEnv = env,
    randomTextGenerator = RandomTextGenerator.create(),
    errorCodeHash = this.errorCodeHash,
  } = {}) {
    const errorHash = this.buildErrorHash({
      errorCodeHash,
    })

    return new this({
      awsClient,
      processEnv,
      randomTextGenerator,
      errorHash,
    })
  }

  /** @inheritdoc */
  async resolve ({
    variables: {
      input: {
        image,
      },
    },
    context,
  }) {
    const {
      file,
      content,
    } = await UploadFileReader.readFile(image)

    const fileType = file.mimetype

    if (!this.isImage(fileType)) {
      throw this.errorHash.InvalidImageFormat.create()
    }

    const filePath = this.composeS3Path({
      filename: file.filename,
    })

    const uploadResult = await this.uploadFileToAWS({
      filePath,
      fileBody: content,
      contentType: file.mimetype,
    })

    if (uploadResult.isFailure) {
      throw this.errorHash.UploadFailed.create()
    }

    const {
      href: url,
    } = new URL(filePath, this.processEnv.AWS_S3_DOMAIN)

    return {
      url,
    }
  }

  /**
   * Check whether file is image.
   *
   * @param {string} fileType
   * @returns {boolean} - True if is image; otherwise false.
   */
  isImage (fileType) {
    return /\b((jpe?g)|(png)|(jpg)|(gif)|(heic))$/u.test(fileType)
  }

  /**
   * compose S3 Path
   *
   * @param {{
   *   filename: string
   * }} param
   * @returns {string} - File path.
   */
  composeS3Path ({
    filename,
  }) {
    const fileUniqueName = `${this.generateFileName()}.${this.getFileExtension(filename)}`

    return `/image/${encodeURIComponent(fileUniqueName)}`
  }

  /**
   * Generate file name.
   *
   * @param {{
   *   fileNameLength?: number
   * }} params
   * @returns {string} - File name.
   */
  generateFileName ({
    fileNameLength = 32,
  } = {}) {
    return this.randomTextGenerator.generate(fileNameLength)
  }

  /**
   * Get file extension.
   *
   * @param {string} fileName
   * @returns {string} - File extension.
   */
  getFileExtension (fileName) {
    const match = /[^.]+$/u.exec(fileName)

    return match
      ? match[0]
      : ''
  }

  /**
   * upload file to AWS
   *
   * @param {{
   *   filePath: string,
   *   contentType: string,
   *   fileBody: Buffer
   * }} param
   * @returns {Promise<import('../../../../../../app/tools/aws/AwsS3FileUploadResult.js').default>}
   */
  async uploadFileToAWS ({
    filePath,
    contentType,
    fileBody,
  }) {
    const payload = await AwsS3FileUploadPayload.create({
      filePath,
      fileBody,
      contentType,
      bucketName: this.processEnv.AWS_S3_BUCKET,
    })

    return this.awsClient.uploadFileToS3(payload)
  }

  /** @inheritdoc */
  get schema () {
    return 'uploadThumbnail'
  }
}

/**
 * @typedef {{
 *   awsClient?: AwsS3Client
 *   processEnv?: object
 *   randomTextGenerator?: RandomTextGenerator
 *   errorCodeHash?: object
 * }} UploadImageMutationResolverParams
 */
/**
 * @typedef {{
 *   awsClient?: AwsS3Client
 *   processEnv?: object
 *   randomTextGenerator?: RandomTextGenerator
 *   errorHash?: object
 * }} UploadImageMutationResolverConstructorParams
 */
