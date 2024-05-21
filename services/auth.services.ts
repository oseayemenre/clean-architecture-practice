import {
  ErrorResponse,
  IAuthRepository,
  IAuthService,
  IBcrypt,
  IJWT,
  IJWTPayload,
  IUser,
  IUserAccess,
  SuccessResponse,
} from "../interfaces";

export class AuthService implements IAuthService {
  private readonly repository;
  private readonly bcrypt;
  private readonly jwt;

  constructor(
    repository: IAuthRepository,
    bcrypt: IBcrypt,
    jwt: IJWT<IJWTPayload>
  ) {
    this.repository = repository;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
  }

  public async onCreateAccount(
    data: IUser
  ): Promise<ErrorResponse | SuccessResponse<IUser>> {
    const findUser = await this.repository.find(data.email);

    if (findUser) {
      return {
        status: "failed",
        message: "User already exists",
        statusCode: 409,
      };
    }

    const password = await this.bcrypt.encrypt(data.password);

    const user = await this.repository.create({
      email: data.email,
      password: password,
    });

    return {
      status: "success",
      message: "User succesfuly created",
      statusCode: 201,
      data: user,
    };
  }

  public async onLogin(
    data: IUser
  ): Promise<ErrorResponse | SuccessResponse<IUserAccess>> {
    const findUser = await this.repository.find(data.email);

    if (!findUser) {
      return {
        status: "failed",
        message: "User doesn't exist",
        statusCode: 404,
      };
    }

    const comparePassword = await this.bcrypt.comparePassword({
      inputPassword: data.password,
      databasePassword: findUser.password,
    });

    if (!comparePassword) {
      return {
        status: "failed",
        message: "Invalid Credentials",
        statusCode: 401,
      };
    }

    const accessToken = this.jwt.signToken({
      data: { id: findUser.id, email: findUser.email },
      secret: "access-token",
      expires: "15m",
    });

    const refreshToken = this.jwt.signToken({
      data: { id: findUser.id, email: findUser.email },
      secret: "refresh-token",
      expires: "1d",
    });

    return {
      status: "success",
      message: "User Logged In Succesfully",
      statusCode: 200,
      data: {
        email: findUser.email,
        password: findUser.password,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }
}
