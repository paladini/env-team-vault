import { User, CreateUserDTO, LoginDTO, RegisterWithTeamDTO, RegisterWithCodeDTO } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { TeamService } from './TeamService';
import * as bcrypt from 'bcryptjs';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private teamRepository: TeamRepository,
    private auditLogRepository: AuditLogRepository,
    private teamService: TeamService
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
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      teamId: userData.teamId
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

  async registerWithTeam(userData: RegisterWithTeamDTO): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create team first
    const teamCode = this.teamService.generateTeamCode();
    const team = await this.teamRepository.create({
      name: userData.teamName,
      code: teamCode
    });
    
    // Create user with teamId
    const user = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      teamId: team.id
    });

    // Create audit log for team creation
    await this.auditLogRepository.create({
      action: 'TEAM_CREATED',
      targetType: 'Team',
      targetId: team.id,
      userId: user.id
    });

    // Create audit log for user registration with team creation
    await this.auditLogRepository.create({
      action: 'USER_REGISTERED',
      targetType: 'User',
      targetId: user.id,
      userId: user.id
    });

    return user;
  }

  async registerWithCode(userData: RegisterWithCodeDTO): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Check if team code exists
    const team = await this.teamRepository.findByCode(userData.teamCode.toUpperCase());
    if (!team) {
      throw new Error('Invalid team code');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user with existing team
    const user = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      teamId: team.id
    });

    // Create audit log for user registration
    await this.auditLogRepository.create({
      action: 'USER_REGISTERED',
      targetType: 'User',
      targetId: user.id,
      userId: user.id
    });

    // Create audit log for joining team by code
    await this.teamService.auditMemberJoinedByCode(team.id, user.id, userData.teamCode);

    return user;
  }

  async login(loginData: LoginDTO): Promise<User | null> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Create audit log for login
    await this.auditLogRepository.create({
      action: 'USER_LOGIN',
      targetType: 'User',
      targetId: user.id,
      userId: user.id
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByTeamId(teamId: string): Promise<User[]> {
    return this.userRepository.findByTeamId(teamId);
  }
}