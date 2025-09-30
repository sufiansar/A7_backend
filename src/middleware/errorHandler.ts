import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error.statusCode = 401;
    error.message = message;
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error.statusCode = 401;
    error.message = message;
  }

  if (err.name === "PrismaClientKnownRequestError") {
    const message = "Database error";
    error.statusCode = 400;
    error.message = message;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
