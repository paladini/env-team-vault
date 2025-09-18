import { PrismaClient } from '@prisma/client';
import { User, CreateUserDTO } from '../../core/entities/User';
import { UserRepository } from '../../core/repositories/UserRepository';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userData: CreateUserDTO): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData
    });
    return {
      ...user,
      teamId: user.teamId || undefined
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    if (!user) return null;
    return {
      ...user,
      teamId: user.teamId || undefined
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) return null;
    return {
      ...user,
      teamId: user.teamId || undefined
    };
  }

  async findByTeamId(teamId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' }
    });
    return users.map(user => ({
      ...user,
      teamId: user.teamId || undefined
    }));
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: userData
      });
      return {
        ...user,
        teamId: user.teamId || undefined
      };
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
