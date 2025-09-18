# Env Team Vault

A simple, self-hosted platform for sharing and synchronizing environment variables for local development between team members.

Demo: [https://youtu.be/Yu-UBjnR45E](https://youtu.be/Yu-UBjnR45E)

NPM Package: [https://www.npmjs.com/package/env-team-vault](https://www.npmjs.com/package/env-team-vault)

## Overview

**Env Team Vault** is designed to solve one specific problem: keeping your team's local `.env` files synchronized without sending them via Slack or email. It provides a central, secure, and audited place to manage the configuration variables that developers use on their local machines.

<img width="1551" height="899" alt="image" src="https://github.com/user-attachments/assets/95d32ffb-2846-407d-9788-3ec9577c2772" />
<img width="1615" height="784" alt="image" src="https://github.com/user-attachments/assets/bcd99ed9-a57f-4d7f-8abb-2fb9ec8a5d3c" />

### Philosophy

- **Simplicity first**: This is not meant to compete with enterprise solutions like Doppler, Infisical, or HashiCorp Vault
- **Local development focus**: Specifically designed for development environment variables, not production secrets
- **Team collaboration**: Easy sharing and synchronization between team members
- **Self-hosted**: Full control over your data and deployment

## Features

- 🔐 **User Authentication**: Secure login/registration system with audit trails
- 👪 **Team Management**: Organize users into teams for better collaboration
- 📱 **Web Interface**: Clean, responsive web UI for managing applications and variables
- 🔑 **Application Management**: Create and organize multiple applications/projects per team
- 🌍 **Environment Variables**: Add, edit, and delete environment variables per application
- 📋 **CLI Integration**: Command-line tool for syncing variables to local `.env` files
- 📊 **Audit Logging**: Track all changes and access for security and compliance
- 🐳 **Docker Ready**: Easy deployment with Docker and Docker Compose

## Quick Start

### Using Docker Compose (Recommended)

1. Clone this repository:
```bash
git clone https://github.com/your-org/env-team-vault.git
cd env-team-vault
```

2. Start the application:
```bash
docker-compose up -d
```

3. Open your browser to `http://localhost:3000`

4. Register a new account and start creating applications!

### Manual Installation

1. Clone and install dependencies:
```bash
git clone https://github.com/your-org/env-team-vault.git
cd env-team-vault
npm install
```

2. Set up the database:
```bash
npm run prisma:migrate
npm run prisma:generate
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Usage

### Web Interface

1. **Register/Login**: Create an account or log in to access the dashboard
2. **Create Team**: During registration, create your team (required)
3. **Team Management**: Access `/team` to manage team members and view team statistics
4. **Invite Members**: Add new team members by email directly from the team page
5. **Create Application**: Add a new application/project to manage (team-based)
6. **Add Variables**: Define environment variables for your application
7. **Copy App ID**: Each application has a unique ID used for CLI access

### CLI Usage

**Important Security Note**: CLI access requires API token authentication. Generate an API Token in your profile to sync variables from your team's applications to your local environment. This ensures all sync operations are audited and secure.

Once you have an application set up with variables, you can sync them to your local development environment:

```bash
# Sync variables to your local .env file
npx env-team-vault sync <APP_ID> --url http://localhost:3000
env-team-vault sync <APP_ID> --url http://localhost:3000

# Example
npx env-team-vault sync 123e4567-e89b-12d3-a456-426614174000 --url http://localhost:3000
env-team-vault sync 320cbca3-4063-4f1c-bf51-9083729c9190 --url http://localhost:3000
```

This will fetch all variables for the specified application (if it belongs to your team) and write them to a `.env` file in your current directory.

## API Reference

### Get Environment Variables

```http
GET /api/vault/:appId
```

Returns environment variables in `.env` format:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
API_KEY=your-api-key-here
DEBUG=true
```

## Configuration

### Environment Variables

- `NODE_ENV`: Application environment (development/production)
- `PORT`: Port to run the server on (default: 3000)
- `SESSION_SECRET`: Secret key for session encryption
- `DATABASE_URL`: SQLite database file path

### Production Deployment

For production deployment:

1. Update `SESSION_SECRET` in docker-compose.yml
2. Consider using a reverse proxy (nginx) with SSL
3. Set up regular database backups
4. Monitor application logs and health


## Audit Events

Env Team Vault automatically records audit events for all critical actions performed by users and the system. These logs provide transparency, accountability, and traceability for your team's environment management.

### List of Audit Events

| Event                | Description                                                      |
|----------------------|------------------------------------------------------------------|
| USER_REGISTERED      | A new user registered an account                                 |
| USER_LOGIN           | A user logged in to the system                                   |
| APPLICATION_CREATED  | A new application was created                                    |
| APPLICATION_UPDATED  | An application was updated                                       |
| APPLICATION_DELETED  | An application was deleted                                       |
| VARIABLE_CREATED     | An environment variable was created                              |
| VARIABLE_UPDATED     | An environment variable was updated                              |
| VARIABLE_DELETED     | An environment variable was deleted                              |
| SYNC_ENV             | Environment variables were synced via CLI/API                    |

Each audit log records:
- **Action**: The type of event (see above)
- **Target Type**: The entity affected (User, Application, Variable)
- **Target ID**: The unique identifier of the affected entity
- **User ID**: The user who performed the action
- **Timestamp**: When the event occurred

See [docs/audit.md](docs/audit.md) for more details.

## Development

### Project Structure

```
env-team-vault/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── prod.db               # Banco SQLite (criado automaticamente)
├── public/
│   └── css/
│       └── style.css         # Estilos da aplicação
├── src/
│   ├── core/                 # Camada de domínio (Clean Architecture)
│   │   ├── entities/         # Entidades de domínio
│   │   ├── repositories/     # Interfaces dos repositórios
│   │   └── use-cases/        # Casos de uso/serviços
│   ├── infra/               # Camada de infraestrutura
│   │   ├── auth/            # Configuração do Passport.js
│   │   ├── database/        # Implementação Prisma
│   │   ├── http/            # Controllers e rotas Express
│   │   └── web/             # Views EJS
│   ├── types/               # Definições de tipos TypeScript
│   └── main.ts              # Ponto de entrada da aplicação
├── docker-compose.yml       # Configuração Docker Compose
├── Dockerfile              # Configuração Docker
├── package.json           # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
└── README.md            # Documentação
```

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:studio`: Open Prisma Studio

### Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: Passport.js with local strategy
- **Frontend**: Server-side rendered EJS templates with vanilla JavaScript
- **Styling**: Custom CSS with responsive design
- **Containerization**: Docker and Docker Compose

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature/my-feature`
6. Submit a pull request

## Roadmap

- [x] **Team Management**: Role-based access control (✅ Implemented)
- [ ] **SSO Integration**: Google and Microsoft OAuth support
- [x] **CLI Package**: Standalone npm package for the CLI tool
- [ ] **Import/Export**: Bulk import/export of environment variables
- [ ] **Variable History**: Track changes to individual variables
- [ ] **Advanced Team Roles**: Admin, Member, and Read-only permissions
- [ ] **Webhooks**: Notifications for variable changes
- [ ] **Environment-specific Variables**: Development, staging, production environments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/paladini/env-team-vault/wiki)
- 🐛 [Issue Tracker](https://github.com/paladini/env-team-vault/issues)
- 💬 [Discussions](https://github.com/paladini/env-team-vault/discussions)

---

Built with ❤️ for development teams who want a simple way to share environment variables.
