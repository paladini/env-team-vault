import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { isAuthenticated } from '../../auth/middleware/isAuthenticated';

export function createTeamRoutes(teamController: TeamController): Router {
  const router = Router();

  // All team routes require authentication
  router.use(isAuthenticated);

  router.get('/team', teamController.getTeamPage);
  router.get('/teams', teamController.getTeamPage); // Redirect /teams to team page
  router.get('/teams/api', teamController.getTeams); // API endpoint moved to /teams/api
  router.get('/teams/:id', teamController.getTeam);
  router.post('/teams', teamController.createTeam);
  router.put('/teams/:id', teamController.updateTeam);
  router.delete('/teams/:id', teamController.deleteTeam);
  router.post('/teams/:id/invite', teamController.inviteMember);

  return router;
}
