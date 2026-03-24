import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/types";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err: AppError = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
};