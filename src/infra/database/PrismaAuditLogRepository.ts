import { PrismaClient } from '@prisma/client';
import { AuditLog, CreateAuditLogDTO } from '../../core/entities/AuditLog';
import { AuditLogRepository } from '../../core/repositories/AuditLogRepository';

export class PrismaAuditLogRepository implements AuditLogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(auditLogData: CreateAuditLogDTO): Promise<AuditLog> {
    return await this.prisma.auditLog.create({
      data: auditLogData
    });
  }

  async findByUserId(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async findByTargetId(targetId: string, limit: number = 50): Promise<AuditLog[]> {
    return await this.prisma.auditLog.findMany({
      where: { targetId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
