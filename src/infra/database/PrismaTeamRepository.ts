import { PrismaClient } from '@prisma/client';
import { TeamRepository } from '../../core/repositories/TeamRepository';
import { Team, CreateTeamData, UpdateTeamData } from '../../core/entities/Team';

export class PrismaTeamRepository implements TeamRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTeamData): Promise<Team> {
    return this.prisma.team.create({
      data: {
        name: data.name,
        code: data.code,
      },
    });
  }

  async findById(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { code },
    });
  }

  async findAll(): Promise<Team[]> {
    return this.prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateTeamData): Promise<Team> {
    return this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.team.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
