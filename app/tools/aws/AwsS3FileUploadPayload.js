import {
  PutObjectCommand,
} from '@aws-sdk/client-s3'

import env from '../../globals/env.js'

export default class AwsS3FileUploadPayload {
  /**
   * constructor
   *
   * @param {AwsS3FileUploadPayloadParams} params
   */
  constructor ({
    filePath,
    fileBody,
    contentType,
    bucketName = env.AWS_S3_BUCKET,
  }) {
    this.filePath = filePath
    this.fileBody = fileBody
    this.contentType = contentType
    this.bucketName = bucketName
  }

  /**
   * create instance
   *
   * @param {AwsS3FileUploadPayloadParams} params
   * @returns {AwsS3FileUploadPayload} - Instance of this class.
   */
  static create (params) {
    return new this(params)
  }

  /**
   * return aws s3 put object params
   *
   * @returns {PutObjectCommand}
   */
  buildParams () {
    return new PutObjectCommand({
      Key: this.filePath,
      Body: this.fileBody,
      ContentType: this.contentType,
      Bucket: this.bucketName,
    })
  }
}

/**
 * @typedef {{
 *   filePath: string,
 *   fileBody: string | Buffer,
 *   contentType: string,
 *   bucketName: string,
 * }} AwsS3FileUploadPayloadParams
 * @typedef {AwsS3FileUploadPayload} AwsS3FileUploadPayloadInstance
 */
