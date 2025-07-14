import { PrismaClient } from '@prisma/client';
import { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../../core/entities/Application';
import { ApplicationRepository } from '../../core/repositories/ApplicationRepository';

export class PrismaApplicationRepository implements ApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(applicationData: CreateApplicationDTO): Promise<Application> {
    return await this.prisma.application.create({
      data: applicationData
    });
  }

  async findById(id: string): Promise<Application | null> {
    return await this.prisma.application.findUnique({
      where: { id }
    });
  }

  async findByUserId(userId: string): Promise<Application[]> {
    return await this.prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, applicationData: UpdateApplicationDTO): Promise<Application | null> {
    try {
      return await this.prisma.application.update({
        where: { id },
        data: applicationData
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.application.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
