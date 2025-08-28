
import { BaseError, TErrorData } from './BaseError.js';

export default class CronError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('Cron error', errorsData);
    this.statusCode = 500;
  }
}
