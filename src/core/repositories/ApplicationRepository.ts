import { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../entities/Application';

export interface ApplicationRepository {
  create(application: CreateApplicationDTO): Promise<Application>;
  findById(id: string): Promise<Application | null>;
  findByUserId(userId: string): Promise<Application[]>;
  update(id: string, application: UpdateApplicationDTO): Promise<Application | null>;
  delete(id: string): Promise<boolean>;
}
