import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface IUser {
  email: string;
  password: string;
}

export interface IUserExpanded {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAccess {
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
  statusCode: number;
}

export interface SuccessResponse<T> {
  status: string;
  statusCode?: number;
  message: string;
  data: T;
}

export interface IAuthService {
  onCreateAccount(data: IUser): Promise<ErrorResponse | SuccessResponse<IUser>>;
  onLogin(data: IUser): Promise<ErrorResponse | SuccessResponse<IUserAccess>>;
}

export interface IAuthRepository {
  create(data: IUser): Promise<IUserExpanded>;
  find(email: string): Promise<IUserExpanded | null>;
}

export interface IBcrypt {
  encrypt(password: string): Promise<string>;
  comparePassword(data: IComparePassword): Promise<boolean>;
}

export type Prisma = PrismaClient;

export interface IComparePassword {
  inputPassword: string;
  databasePassword: string;
}

export interface IJWT<T> {
  signToken(data: { data: T; secret: string; expires: string }): string;
  decodeToken(data: { token: string; secret: string }): JwtPayload;
}

export interface IJWTPayload {
  id: string;
  email: string;
}
