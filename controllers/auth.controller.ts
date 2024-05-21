import { NextFunction, Request, Response } from "express";
import {
  ErrorResponse,
  IAuthService,
  IUser,
  SuccessResponse,
} from "../interfaces";

export class AuthController {
  private readonly service: IAuthService;

  constructor(service: IAuthService) {
    this.service = service;
  }

  public async createAccount(
    req: Request,
    res: Response<Omit<ErrorResponse, "statusCode"> | SuccessResponse<IUser>>,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const response = await this.service.onCreateAccount({
        email: email,
        password: password,
      });

      if ("data" in response) {
        return res.status(response.statusCode as number).json({
          status: "success",
          message: response.message,
          data: response.data,
        });
      }

      return res.status(response.statusCode as number).json({
        status: "failed",
        message: response.message,
      });
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const response = await this.service.onLogin({
        email: email,
        password: password,
      });

      if ("data" in response) {
        res.cookie("access-token", response.data.accessToken, {
          maxAge: 15 * 60 * 1000,
          httpOnly: true,
        });

        res.cookie("refresh-token", response.data.refreshToken, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        return res.status(response.statusCode as number).json({
          status: "success",
          message: response.message,
          data: response.data,
        });
      }

      return res.status(response.statusCode as number).json({
        status: "failed",
        message: response.message,
      });
    } catch (err) {
      next(err);
    }
  }
}
