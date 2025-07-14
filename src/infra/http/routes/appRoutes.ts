import { Router } from 'express';
import { ApplicationController } from '../controllers/ApplicationController';
import { VariableController } from '../controllers/VariableController';
import { isAuthenticated } from '../../auth/middleware/isAuthenticated';

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

  return router;
}
