import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { isAuthenticated } from '../../auth/middleware/isAuthenticated';

export function createProfileRoutes(profileController: ProfileController): Router {
  const router = Router();
  router.get('/profile', isAuthenticated, profileController.getProfile.bind(profileController));
  return router;
}
