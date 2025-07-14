import { User, CreateUserDTO, LoginDTO } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import * as bcrypt from 'bcryptjs';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private auditLogRepository: AuditLogRepository
  ) {}

  async register(userData: CreateUserDTO): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    // Create audit log
    await this.auditLogRepository.create({
      action: 'USER_REGISTERED',
      targetType: 'User',
      targetId: user.id,
      userId: user.id
    });

    return user;
  }

  async login(loginData: LoginDTO): Promise<User | null> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(loginData.password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Create audit log
    await this.auditLogRepository.create({
      action: 'USER_LOGIN',
      targetType: 'User',
      targetId: user.id,
      userId: user.id
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
