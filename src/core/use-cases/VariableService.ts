import { Variable, CreateVariableDTO, UpdateVariableDTO } from '../entities/Variable';
import { VariableRepository } from '../repositories/VariableRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';

export class VariableService {
  constructor(
    private variableRepository: VariableRepository,
    private auditLogRepository: AuditLogRepository
  ) {}

  async create(variableData: CreateVariableDTO, userId: string): Promise<Variable> {
    // Check if variable already exists
    const existing = await this.variableRepository.findByApplicationIdAndKey(
      variableData.applicationId,
      variableData.key
    );
    
    if (existing) {
      throw new Error('Variable with this key already exists in this application');
    }

    const variable = await this.variableRepository.create(variableData);

    // Create audit log
    await this.auditLogRepository.create({
      action: 'VARIABLE_CREATED',
      targetType: 'Variable',
      targetId: variable.id.toString(),
      userId
    });

    return variable;
  }

  async findById(id: number): Promise<Variable | null> {
    return await this.variableRepository.findById(id);
  }

  async findByApplicationId(applicationId: string): Promise<Variable[]> {
    return await this.variableRepository.findByApplicationId(applicationId);
  }

  async update(id: number, variableData: UpdateVariableDTO, userId: string): Promise<Variable | null> {
    const variable = await this.variableRepository.update(id, variableData);
    
    if (variable) {
      // Create audit log
      await this.auditLogRepository.create({
        action: 'VARIABLE_UPDATED',
        targetType: 'Variable',
        targetId: variable.id.toString(),
        userId
      });
    }

    return variable;
  }

  async delete(id: number, userId: string): Promise<boolean> {
    const success = await this.variableRepository.delete(id);
    
    if (success) {
      // Create audit log
      await this.auditLogRepository.create({
        action: 'VARIABLE_DELETED',
        targetType: 'Variable',
        targetId: id.toString(),
        userId
      });
    }

    return success;
  }

  async getEnvFileContent(applicationId: string): Promise<string> {
    const variables = await this.variableRepository.findByApplicationId(applicationId);
    
    return variables
      .map(variable => `${variable.key}=${variable.value}`)
      .join('\n');
  }
}
