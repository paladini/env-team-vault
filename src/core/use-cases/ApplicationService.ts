import { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../entities/Application';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { VariableRepository } from '../repositories/VariableRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';

export class ApplicationService {
  constructor(
    private applicationRepository: ApplicationRepository,
    private variableRepository: VariableRepository,
    private auditLogRepository: AuditLogRepository
  ) {}

  async create(applicationData: CreateApplicationDTO, userId: string): Promise<Application> {
    const application = await this.applicationRepository.create({
      ...applicationData,
      userId
    });

    // Create audit log
    await this.auditLogRepository.create({
      action: 'APPLICATION_CREATED',
      targetType: 'Application',
      targetId: application.id,
      userId
    });

    return application;
  }

  async findById(id: string): Promise<Application | null> {
    return await this.applicationRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<Application[]> {
    return await this.applicationRepository.findByUserId(userId);
  }

  async update(id: string, applicationData: UpdateApplicationDTO, userId: string): Promise<Application | null> {
    const application = await this.applicationRepository.update(id, applicationData);
    
    if (application) {
      // Create audit log
      await this.auditLogRepository.create({
        action: 'APPLICATION_UPDATED',
        targetType: 'Application',
        targetId: application.id,
        userId
      });
    }

    return application;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    // Delete all variables first
    await this.variableRepository.deleteByApplicationId(id);
    
    const success = await this.applicationRepository.delete(id);
    
    if (success) {
      // Create audit log
      await this.auditLogRepository.create({
        action: 'APPLICATION_DELETED',
        targetType: 'Application',
        targetId: id,
        userId
      });
    }

    return success;
  }
}
