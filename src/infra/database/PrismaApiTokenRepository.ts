import { PrismaClient } from '@prisma/client';

export class PrismaApiTokenRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, token: string) {
    return await this.prisma.apiToken.create({
      data: { userId, token }
    });
  }

  async findByToken(token: string) {
    return await this.prisma.apiToken.findUnique({
      where: { token }
    });
  }

  async revoke(token: string) {
    return await this.prisma.apiToken.update({
      where: { token },
      data: { revoked: true }
    });
  }

  async listByUser(userId: string) {
    return await this.prisma.apiToken.findMany({
      where: { userId }
    });
  }
}
