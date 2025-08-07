import { Request, Response } from 'express';
import { TeamService } from '../../../core/use-cases/TeamService';
import { UserService } from '../../../core/use-cases/UserService';
import { ApplicationService } from '../../../core/use-cases/ApplicationService';
import { VariableService } from '../../../core/use-cases/VariableService';

export class TeamController {
  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private applicationService: ApplicationService,
    private variableService: VariableService
  ) {}

  // GET /team
  getTeamPage = async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      if (!user.teamId) {
        return res.status(400).send('User must be part of a team');
      }
      
      const team = await this.teamService.findById(user.teamId);
      if (!team) {
        return res.status(404).send('Team not found');
      }
      
      // Get team members
      const members = await this.userService.findByTeamId(user.teamId);
      
      // Get team applications
      const applications = await this.applicationService.findByTeamId(user.teamId);
      
      // Count total variables across all applications
      let totalVariables = 0;
      for (const app of applications) {
        const variables = await this.variableService.findByApplicationId(app.id);
        totalVariables += variables.length;
      }
      
      // Audit team code view
      await this.teamService.auditCodeViewed(team.id, user.id);
      
      res.render('team', { 
        team,
        members,
        applications,
        totalVariables,
        user, 
        title: `${team.name} - Team Management`,
        currentPage: 'teams'
      });
    } catch (error) {
      console.error('Error loading team page:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  // GET /teams
  getTeams = async (req: Request, res: Response) => {
    try {
      const teams = await this.teamService.findAll();
      res.json(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ error: 'Failed to fetch teams' });
    }
  };

  // GET /teams/:id
  getTeam = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const team = await this.teamService.findById(id);
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      res.json(team);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  };

  // POST /teams
  createTeam = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const user = req.user as any;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Team name is required' });
      }

      const teamCode = this.teamService.generateTeamCode();
      const team = await this.teamService.create({ 
        name: name.trim(),
        code: teamCode
      }, user.id);
      res.status(201).json(team);
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({ error: 'Failed to create team' });
    }
  };

  // PUT /teams/:id
  updateTeam = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const user = req.user as any;

      // Check if user belongs to this team
      if (user.teamId !== id) {
        return res.status(403).json({ error: 'Access denied: You can only update your own team' });
      }

      const team = await this.teamService.update(id, { name }, user.id);
      res.json(team);
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({ error: 'Failed to update team' });
    }
  };

  // DELETE /teams/:id
  deleteTeam = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user as any;

      // Check if user belongs to this team
      if (user.teamId !== id) {
        return res.status(403).json({ error: 'Access denied: You can only delete your own team' });
      }

      const success = await this.teamService.delete(id, user.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete team' });
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ error: 'Failed to delete team' });
    }
  };

  // POST /teams/:id/invite
  inviteMember = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email, name } = req.body;
      const user = req.user as any;

      // Check if user belongs to this team
      if (user.teamId !== id) {
        return res.status(403).json({ error: 'Access denied: You can only invite members to your own team' });
      }

      // Check if user already exists
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // For simplicity, create user without password (they'll need to set one)
      // In a real implementation, you'd send an invitation email
      const tempPassword = Math.random().toString(36).slice(-8); // Generate temp password
      
      const newUser = await this.userService.register({
        name,
        email,
        password: tempPassword, // They'll need to change this
        teamId: id
      });

      // Audit log for team member invitation
      await this.teamService.auditMemberInvited(id, user.id, newUser.id);

      res.json({ 
        message: 'Member invited successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        },
        tempPassword // In production, this would be sent via email
      });
    } catch (error) {
      console.error('Error inviting member:', error);
      res.status(500).json({ error: 'Failed to invite member' });
    }
  };
}
