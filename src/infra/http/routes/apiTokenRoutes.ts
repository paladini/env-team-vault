import { Router } from 'express';
import { ApiTokenController } from '../controllers/ApiTokenController';
import { isAuthenticated } from '../../auth/middleware/isAuthenticated';

export function createApiTokenRoutes(apiTokenController: ApiTokenController): Router {
  const router = Router();
  router.post('/token', isAuthenticated, apiTokenController.createToken);
  router.get('/token', isAuthenticated, apiTokenController.listTokens);
  router.post('/token/revoke', isAuthenticated, apiTokenController.revokeToken);
  return router;
}
