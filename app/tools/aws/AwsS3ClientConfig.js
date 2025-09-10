import env from '../../globals/env.js'

export default class AwsS3ClientConfig {
  /**
   * constructor
   *
   * @param {AwsS3ClientConfigInstanceParams} params
   */
  constructor ({
    secretAccessKey = env.AWS_SECRET_ACCESS_KEY,
    accessKeyId = env.AWS_ACCESS_KEY,
    region = env.AWS_REGION,
  } = {}) {
    this.secretAccessKey = secretAccessKey
    this.accessKeyId = accessKeyId
    this.region = region
  }

  /**
   * create instance of AwsS3ClientConfig
   *
   * @param {AwsS3ClientConfigInstanceParams} params
   * @returns {AwsS3ClientConfig} - Instance of this class.
   */
  static create (params = {}) {
    return new this(params)
  }

  /**
   * return config
   *
   * @returns {AwsS3ClientConfigParams}
   */
  get config () {
    return {
      credentials: {
        secretAccessKey: this.secretAccessKey,
        accessKeyId: this.accessKeyId,
      },
      region: this.region,
    }
  }
}

/**
 * @typedef {{
 *   secretAccessKey?: string,
 *   accessKeyId?: string
 *   region?: string
 * }} AwsS3ClientConfigInstanceParams
 * @typedef {{
 *   credentials: {
 *     secretAccessKey: string,
 *     accessKeyId: string
 *   },
 *   region: string
 * }} AwsS3ClientConfigParams
 * @typedef {AwsS3ClientConfig} AwsS3ClientConfigInstance
 */
