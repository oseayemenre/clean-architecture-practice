import bcrypt from "bcrypt";
import { IBcrypt, IComparePassword } from "../interfaces";

export class Bcrypt implements IBcrypt {
  public async encrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  public async comparePassword(data: IComparePassword): Promise<boolean> {
    return await bcrypt.compare(data.inputPassword, data.databasePassword);
  }
}
