
import { BaseError, TErrorData } from './BaseError.js';

export class ServerTemporarilyUnavailableError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('Service temporarily unavailable error', errorsData);
    this.statusCode = 503;
  }
}
