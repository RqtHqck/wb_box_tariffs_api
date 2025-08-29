
import { BaseError, TErrorData } from './BaseError.js';

export default class NotFoundError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('NotFound error', errorsData);
    this.statusCode = 404;
  }
}
