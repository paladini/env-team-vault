export interface AuditLog {
  id: number;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: Date;
  userId: string;
}

export interface CreateAuditLogDTO {
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  userId: string;
}
