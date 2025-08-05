import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const status = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';
  const responseBody: any = { success: false, message };

  if (err.details) responseBody.details = err.details;

  // Only log stack in development
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack ?? err.message);
  }

  res.status(status).json(responseBody);
};
