import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const ErrorHandlerPracrice = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode: httpStatus.BAD_REQUEST;
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: errorMessage,
    error: err.stack,
  });
};
