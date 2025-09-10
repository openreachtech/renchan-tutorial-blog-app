/**
 * @template Payload,RawResult
 */
export default class AwsS3OperationResult {
  /**
   * Initialize.
   *
   * @param {{
   *   payload: Payload,
   *   rawResult?: RawResult?,
   *   error?: Error?
   * }} params
   */
  constructor ({
    payload,
    rawResult = null,
    error = null,
  }) {
    this.payload = payload

    this.rawResult = rawResult
    this.error = error
  }

  /**
   * Create instance of this class.
   *
   * @param {{
   *   payload: object,
   *   rawResult?: object,
   *   error?: Error
   * }} params
   * @returns {AwsS3OperationResult} - Instance of this class.
   */
  static create (params) {
    return new this(params)
  }

  /**
   * Indicate whether operation success.
   *
   * @returns {boolean} - True if operation success; otherwise false.
   */
  get isSuccess () {
    return !this.error
  }

  /**
   * Indicate whether operation failure.
   *
   * @returns {boolean} - True if operation failure; otherwise false.
   */
  get isFailure () {
    return !this.isSuccess
  }
}
