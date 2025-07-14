import { Request, Response } from 'express';
import { ApplicationService } from '../../../core/use-cases/ApplicationService';
import { VariableService } from '../../../core/use-cases/VariableService';

export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private variableService: VariableService
  ) {}

  // GET /
  getIndex = async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const applications = await this.applicationService.findByUserId(user.id);
      res.render('index', { 
        applications, 
        user, 
        title: 'Applications' 
      });
    } catch (error) {
      console.error('Error loading applications:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  // GET /app/:id
  getApplicationDetails = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user as any;
      
      const application = await this.applicationService.findById(id);
      if (!application || application.userId !== user.id) {
        return res.status(404).send('Application not found');
      }

      const variables = await this.variableService.findByApplicationId(id);
      
      res.render('app-details', { 
        application, 
        variables, 
        user, 
        title: application.name 
      });
    } catch (error) {
      console.error('Error loading application details:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  // POST /app
  createApplication = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const user = req.user as any;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Application name is required' });
      }

      const application = await this.applicationService.create({ name: name.trim(), userId: user.id }, user.id);
      res.json(application);
    } catch (error) {
      console.error('Error creating application:', error);
      res.status(500).json({ error: 'Failed to create application' });
    }
  };

  // PUT /app/:id
  updateApplication = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const user = req.user as any;

      // Check if application belongs to user
      const existingApp = await this.applicationService.findById(id);
      if (!existingApp || existingApp.userId !== user.id) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const application = await this.applicationService.update(id, { name }, user.id);
      res.json(application);
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ error: 'Failed to update application' });
    }
  };

  // DELETE /app/:id
  deleteApplication = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user as any;

      // Check if application belongs to user
      const existingApp = await this.applicationService.findById(id);
      if (!existingApp || existingApp.userId !== user.id) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const success = await this.applicationService.delete(id, user.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete application' });
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ error: 'Failed to delete application' });
    }
  };
}
