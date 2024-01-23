import { Request, Response, NextFunction } from "express";

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (req.accepts("json")) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(err.statusCode).send(`<h1>${err.message}</h1>`);
};

export default ErrorHandler;
