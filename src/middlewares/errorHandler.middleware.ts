import { BaseError, TErrorData } from '#errors/BaseError.js';
import { handleError } from '#utils/errorHandler.js';
import {ErrorRequestHandler, Request, Response} from 'express';


export const ErrorsHandlerMiddleware: ErrorRequestHandler = (
    error, 
    req, 
    res, 
    next
): void => {
  const { status, body } = handleError(error);
  res.status(status).send(body);
}