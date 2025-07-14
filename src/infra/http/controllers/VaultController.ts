import { Request, Response } from 'express';
import { VariableService } from '../../../core/use-cases/VariableService';
import { ApplicationService } from '../../../core/use-cases/ApplicationService';

export class VaultController {
  constructor(
    private variableService: VariableService,
    private applicationService: ApplicationService
  ) {}

  // GET /api/vault/:appId
  getEnvFile = async (req: Request, res: Response) => {
    try {
      const { appId } = req.params;

      // Validate that application exists
      const application = await this.applicationService.findById(appId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
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
