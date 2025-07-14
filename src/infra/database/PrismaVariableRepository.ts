import { PrismaClient } from '@prisma/client';
import { Variable, CreateVariableDTO, UpdateVariableDTO } from '../../core/entities/Variable';
import { VariableRepository } from '../../core/repositories/VariableRepository';

export class PrismaVariableRepository implements VariableRepository {
  constructor(private prisma: PrismaClient) {}

  async create(variableData: CreateVariableDTO): Promise<Variable> {
    return await this.prisma.variable.create({
      data: variableData
    });
  }

  async findById(id: number): Promise<Variable | null> {
    return await this.prisma.variable.findUnique({
      where: { id }
    });
  }

  async findByApplicationId(applicationId: string): Promise<Variable[]> {
    return await this.prisma.variable.findMany({
      where: { applicationId },
      orderBy: { key: 'asc' }
    });
  }

  async findByApplicationIdAndKey(applicationId: string, key: string): Promise<Variable | null> {
    return await this.prisma.variable.findUnique({
      where: {
        applicationId_key: {
          applicationId,
          key
        }
      }
    });
  }

  async update(id: number, variableData: UpdateVariableDTO): Promise<Variable | null> {
    try {
      return await this.prisma.variable.update({
        where: { id },
        data: variableData
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.variable.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteByApplicationId(applicationId: string): Promise<boolean> {
    try {
      await this.prisma.variable.deleteMany({
        where: { applicationId }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
