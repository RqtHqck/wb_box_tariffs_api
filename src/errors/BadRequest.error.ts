
import { BaseError, TErrorData } from './BaseError.js';

export default class BadRequestError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('BadRequest error', errorsData);
    this.statusCode = 400;
  }
}
