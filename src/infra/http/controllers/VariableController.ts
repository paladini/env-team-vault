import { Request, Response } from 'express';
import { VariableService } from '../../../core/use-cases/VariableService';
import { ApplicationService } from '../../../core/use-cases/ApplicationService';

export class VariableController {
  constructor(
    private variableService: VariableService,
    private applicationService: ApplicationService
  ) {}

  // POST /app/:appId/variable
  createVariable = async (req: Request, res: Response) => {
    try {
      const { appId } = req.params;
      const { key, value } = req.body;
      const user = req.user as any;

      if (!key || !value) {
        return res.status(400).json({ error: 'Key and value are required' });
      }

      // Check if application belongs to user
      const application = await this.applicationService.findById(appId);
      if (!application || application.userId !== user.id) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const variable = await this.variableService.create({ 
        key: key.trim(), 
        value: value.trim(), 
        applicationId: appId 
      }, user.id);
      
      res.json(variable);
    } catch (error: any) {
      console.error('Error creating variable:', error);
      res.status(500).json({ error: error.message || 'Failed to create variable' });
    }
  };

  // PUT /variable/:id
  updateVariable = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { key, value } = req.body;
      const user = req.user as any;

      const variable = await this.variableService.update(parseInt(id), { key, value }, user.id);
      if (variable) {
        res.json(variable);
      } else {
        res.status(404).json({ error: 'Variable not found' });
      }
    } catch (error) {
      console.error('Error updating variable:', error);
      res.status(500).json({ error: 'Failed to update variable' });
    }
  };

  // DELETE /variable/:id
  deleteVariable = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user as any;

      const success = await this.variableService.delete(parseInt(id), user.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Variable not found' });
      }
    } catch (error) {
      console.error('Error deleting variable:', error);
      res.status(500).json({ error: 'Failed to delete variable' });
    }
  };
}
