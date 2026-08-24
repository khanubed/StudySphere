import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const field = e.path.join('.') || 'body';
      if (!errors[field]) errors[field] = [];
      errors[field].push(e.message);
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  if (err.code === 'TOKEN_LIMIT_EXCEEDED') {
    return res.status(402).json({
      success: false,
      code: 'TOKEN_LIMIT_EXCEEDED',
      message: err.message || 'Token limit exceeded',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
