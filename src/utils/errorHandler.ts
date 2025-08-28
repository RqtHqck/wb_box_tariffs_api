import { BaseError, TErrorData } from "#errors/BaseError.js";
import { ErrorResponse } from "#interfaces/responses.interface.js";

export function handleError(error: Error): ErrorResponse {
  let status: number;
  let body: ErrorResponse['body'];

  if (error instanceof BaseError && error.statusCode) {
    status = error.statusCode;
    body = {
      code: error.code,
      text: error.text,
      data: error.data as TErrorData,
    };
  } else {
    status = 500;
    body = {
      code: 'uncaught_error',
      text: 'Uncaught error',
      data: { message: error.message, stack: error.stack },
    };
  }

  console.error(`[ERROR] status=${status} code=${body.code}`, body);
  return { status, body };
}
