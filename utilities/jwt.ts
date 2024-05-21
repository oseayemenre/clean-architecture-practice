import jwt, { JwtPayload } from "jsonwebtoken";
import { IJWT, IJWTPayload } from "../interfaces";

export class JWT implements IJWT<IJWTPayload> {
  public signToken(data: {
    data: IJWTPayload;
    secret: string;
    expires: string;
  }): string {
    return jwt.sign(data.data, data.secret, { expiresIn: data.expires });
  }

  public decodeToken(data: { token: string; secret: string }): JwtPayload {
    return jwt.verify(data.token, data.secret) as JwtPayload;
  }
}
