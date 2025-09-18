import { Request, Response } from 'express';
import { VariableService } from '../../../core/use-cases/VariableService';
import { ApplicationService } from '../../../core/use-cases/ApplicationService';
import { PrismaApiTokenRepository } from '../../database/PrismaApiTokenRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apiTokenRepo = new PrismaApiTokenRepository(prisma);

export class VaultController {
  constructor(
    private variableService: VariableService,
    private applicationService: ApplicationService
  ) {}

  // GET /api/vault/:appId
  getEnvFile = async (req: Request, res: Response) => {
    try {
      const { appId } = req.params;
      let userId: string | null = null;
      
      // API Token authentication
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const found = await apiTokenRepo.findByToken(token);
        if (!found || found.revoked) {
          return res.status(401).json({ error: 'Invalid or revoked API token' });
        }
        userId = found.userId;
        
        // Get user to check team membership
        const user = await prisma.user.findUnique({
          where: { id: userId }
        }) as any;
        
        if (!user || !user.teamId) {
          return res.status(403).json({ error: 'User must be part of a team' });
        }
        
        // Validate that application exists and belongs to user's team
        const application = await this.applicationService.findById(appId);
        if (!application) {
          return res.status(404).json({ error: 'Application not found' });
        }
        
        if (application.teamId !== user.teamId) {
          return res.status(403).json({ error: 'Access denied: Application does not belong to your team' });
        }
        
        await prisma.auditLog.create({
          data: {
            action: 'SYNC_ENV',
            targetType: 'Application',
            targetId: appId,
            userId: userId,
            createdAt: new Date()
          }
        });
      } else {
        // Validate that application exists (for backward compatibility without auth)
        const application = await this.applicationService.findById(appId);
        if (!application) {
          return res.status(404).json({ error: 'Application not found' });
        }
      }
      
      // Get environment variables as .env format
      const envContent = await this.variableService.getEnvFileContent(appId);
      res.setHeader('Content-Type', 'text/plain');
      res.send(envContent);
    } catch (error) {
      console.error('Error getting env file:', error);
      res.status(500).json({ error: 'Failed to retrieve environment variables' });
    }
  };
}
