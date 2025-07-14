import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import path from 'path';
import { configurePassport } from './infra/auth/passport-config';
import { prisma } from './infra/database/prisma';

// Repositories
import { PrismaUserRepository } from './infra/database/PrismaUserRepository';
import { PrismaApplicationRepository } from './infra/database/PrismaApplicationRepository';
import { PrismaVariableRepository } from './infra/database/PrismaVariableRepository';
import { PrismaAuditLogRepository } from './infra/database/PrismaAuditLogRepository';

// Services
import { UserService } from './core/use-cases/UserService';
import { ApplicationService } from './core/use-cases/ApplicationService';
import { VariableService } from './core/use-cases/VariableService';

// Controllers
import { AuthController } from './infra/http/controllers/AuthController';
import { ApplicationController } from './infra/http/controllers/ApplicationController';
import { VariableController } from './infra/http/controllers/VariableController';
import { VaultController } from './infra/http/controllers/VaultController';

// Routes
import { createAuthRoutes } from './infra/http/routes/authRoutes';
import { createAppRoutes } from './infra/http/routes/appRoutes';
import { createApiRoutes } from './infra/http/routes/apiRoutes';

const SQLiteStore = require('connect-sqlite3')(session);

async function createApp() {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../public')));

  // Session configuration
  app.use(session({
    store: new SQLiteStore({
      db: 'sessions.db',
      table: 'sessions'
    }),
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // View engine setup
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'infra/web/views'));
  app.use(expressLayouts);
  app.set('layout', 'partials/layout');

  // Initialize repositories
  const userRepository = new PrismaUserRepository(prisma);
  const applicationRepository = new PrismaApplicationRepository(prisma);
  const variableRepository = new PrismaVariableRepository(prisma);
  const auditLogRepository = new PrismaAuditLogRepository(prisma);

  // Initialize services
  const userService = new UserService(userRepository, auditLogRepository);
  const applicationService = new ApplicationService(applicationRepository, variableRepository, auditLogRepository);
  const variableService = new VariableService(variableRepository, auditLogRepository);

  // Initialize controllers
  const authController = new AuthController(userService);
  const applicationController = new ApplicationController(applicationService, variableService);
  const variableController = new VariableController(variableService, applicationService);
  const vaultController = new VaultController(variableService, applicationService);

  // Configure Passport
  configurePassport(userService);
  app.use(passport.initialize());
  app.use(passport.session());

  // Flash messages middleware
  app.use(flash());

  // Routes
  app.use('/', createAuthRoutes(authController));
  app.use('/', createAppRoutes(applicationController, variableController));
  app.use('/api', createApiRoutes(vaultController));

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}

async function startServer() {
  const app = await createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`🚀 Env Team Vault is running on port ${port}`);
    console.log(`📱 Access the web interface at: http://localhost:${port}`);
    console.log(`🔗 API endpoint for CLI: http://localhost:${port}/api/vault/:appId`);
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

if (require.main === module) {
  startServer().catch(console.error);
}

export { createApp };
