import { IAuthRepository, IUser, IUserExpanded, Prisma } from "../interfaces";

export class AuthRepository implements IAuthRepository {
  private readonly prisma;

  constructor(prisma: Prisma) {
    this.prisma = prisma;
  }

  public async create(data: IUser): Promise<IUserExpanded> {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  }

  public async find(email: string): Promise<IUserExpanded | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
