import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { isNotAuthenticated } from '../../auth/middleware/isAuthenticated';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // Login routes
  router.get('/login', isNotAuthenticated, authController.getLogin);
  router.post('/login', isNotAuthenticated, authController.postLogin);

  // Register routes
  router.get('/register', isNotAuthenticated, authController.getRegister);
  router.post('/register', isNotAuthenticated, authController.postRegister);

  // Logout route
  router.post('/logout', authController.logout);

  return router;
}
