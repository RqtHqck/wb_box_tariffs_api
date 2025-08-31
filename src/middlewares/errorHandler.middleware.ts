import { handleError } from '#utils/errorHandler.js';
import {ErrorRequestHandler} from 'express';


export const ErrorsHandlerMiddleware: ErrorRequestHandler = (
    error, 
    req, 
    res, 
    next
): void => {
  const { status, body } = handleError(error);
  res.status(status).send(body);
}