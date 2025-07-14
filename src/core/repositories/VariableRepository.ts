import { Variable, CreateVariableDTO, UpdateVariableDTO } from '../entities/Variable';

export interface VariableRepository {
  create(variable: CreateVariableDTO): Promise<Variable>;
  findById(id: number): Promise<Variable | null>;
  findByApplicationId(applicationId: string): Promise<Variable[]>;
  findByApplicationIdAndKey(applicationId: string, key: string): Promise<Variable | null>;
  update(id: number, variable: UpdateVariableDTO): Promise<Variable | null>;
  delete(id: number): Promise<boolean>;
  deleteByApplicationId(applicationId: string): Promise<boolean>;
}
