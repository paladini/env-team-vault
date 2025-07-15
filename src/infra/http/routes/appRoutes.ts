import { Router } from 'express';
import { ApplicationController } from '../controllers/ApplicationController';
import { VariableController } from '../controllers/VariableController';
import { isAuthenticated } from '../../auth/middleware/isAuthenticated';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function createAppRoutes(
  applicationController: ApplicationController,
  variableController: VariableController
): Router {
  const router = Router();

  // All routes require authentication
  router.use(isAuthenticated);

  // Application routes
  router.get('/', applicationController.getIndex);
  router.get('/app/:id', applicationController.getApplicationDetails);
  router.post('/app', applicationController.createApplication);
  router.put('/app/:id', applicationController.updateApplication);
  router.delete('/app/:id', applicationController.deleteApplication);

  // Variable routes
  router.post('/app/:appId/variable', variableController.createVariable);
  router.put('/variable/:id', variableController.updateVariable);
  router.delete('/variable/:id', variableController.deleteVariable);

  // Logs route
  router.get('/logs', async (req, res) => {
    try {
      const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to 100 logs for performance
      });
      res.render('logs', { logs, title: 'System Logs' });
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).send('Failed to load logs');
    }
  });

  return router;
}
