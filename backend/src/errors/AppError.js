export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [status=400]
   */
  constructor(message, status = 400) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}
