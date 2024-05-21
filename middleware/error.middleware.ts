import { NextFunction, Request, Response } from "express";
import { IErrorResponse } from "../interfaces/error.interface";

export class ErrorMiddleWare {
  public errorMiddleWare(
    error: Error,
    req: Request,
    res: Response<IErrorResponse>,
    next: NextFunction
  ): void {
    res.status(500).json({
      status: "failed",
      message: error.message || "Internal server Error",
      stackTrace: process.env.NODE_ENV !== "production" ? error.stack : null,
    });

    return next();
  }
}
