import { Team, CreateTeamData, UpdateTeamData } from '../entities/Team';

export interface TeamRepository {
  create(data: CreateTeamData): Promise<Team>;
  findById(id: string): Promise<Team | null>;
  findByCode(code: string): Promise<Team | null>;
  findAll(): Promise<Team[]>;
  update(id: string, data: UpdateTeamData): Promise<Team>;
  delete(id: string): Promise<boolean>;
}
