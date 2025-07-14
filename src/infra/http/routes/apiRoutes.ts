import { Router } from 'express';
import { VaultController } from '../controllers/VaultController';

export function createApiRoutes(vaultController: VaultController): Router {
  const router = Router();

  // Public API route for CLI access
  router.get('/vault/:appId', vaultController.getEnvFile);

  return router;
}
