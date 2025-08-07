import { TeamRepository } from '../repositories/TeamRepository';
import { AuditLogRepository } from '../repositories/AuditLogRepository';
import { Team, CreateTeamData, UpdateTeamData } from '../entities/Team';

export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
    private auditLogRepository: AuditLogRepository
  ) {}

  public generateTeamCode(): string {
    // Gera código de 6 caracteres aleatórios (exclui 0, O, I, L para evitar confusão)
    const chars = 'ABCDEFGHIJKMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async create(data: CreateTeamData, userId: string): Promise<Team> {
    // Gera código único
    let code: string;
    let codeExists = true;
    
    do {
      code = this.generateTeamCode();
      const existingTeam = await this.teamRepository.findByCode(code);
      codeExists = !!existingTeam;
    } while (codeExists);
    
    const team = await this.teamRepository.create({
      name: data.name,
      code
    });
    
    await this.auditLogRepository.create({
      action: 'TEAM_CREATED',
      targetType: 'Team',
      targetId: team.id,
      userId,
    });
    
    return team;
  }

  async findById(id: string): Promise<Team | null> {
    return this.teamRepository.findById(id);
  }

  async findByCode(code: string): Promise<Team | null> {
    return this.teamRepository.findByCode(code);
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  async update(id: string, data: UpdateTeamData, userId: string): Promise<Team> {
    const team = await this.teamRepository.update(id, data);
    
    await this.auditLogRepository.create({
      action: 'TEAM_UPDATED',
      targetType: 'Team',
      targetId: id,
      userId,
    });
    
    return team;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const success = await this.teamRepository.delete(id);
    
    if (success) {
      await this.auditLogRepository.create({
        action: 'TEAM_DELETED',
        targetType: 'Team',
        targetId: id,
        userId,
      });
    }
    
    return success;
  }

  // Audit methods for team-related events
  async auditMemberInvited(teamId: string, inviterId: string, invitedUserId: string): Promise<void> {
    await this.auditLogRepository.create({
      action: 'TEAM_MEMBER_INVITED',
      targetType: 'Team',
      targetId: teamId,
      userId: inviterId,
    });
  }

  async auditMemberJoinedByCode(teamId: string, userId: string, teamCode: string): Promise<void> {
    await this.auditLogRepository.create({
      action: 'TEAM_JOINED_BY_CODE',
      targetType: 'Team', 
      targetId: teamId,
      userId: userId,
    });
  }

  async auditCodeViewed(teamId: string, userId: string): Promise<void> {
    await this.auditLogRepository.create({
      action: 'TEAM_CODE_VIEWED',
      targetType: 'Team',
      targetId: teamId,
      userId: userId,
    });
  }
}
