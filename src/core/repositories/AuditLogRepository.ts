import { AuditLog, CreateAuditLogDTO } from '../entities/AuditLog';

export interface AuditLogRepository {
  create(auditLog: CreateAuditLogDTO): Promise<AuditLog>;
  findByUserId(userId: string, limit?: number): Promise<AuditLog[]>;
  findByTargetId(targetId: string, limit?: number): Promise<AuditLog[]>;
}
