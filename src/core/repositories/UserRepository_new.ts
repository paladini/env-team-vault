import { User, CreateUserDTO } from '../entities/User';

export interface UserRepository {
  create(userData: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByTeamId(teamId: string): Promise<User[]>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
