# Env Team Vault

A simple, self-hosted platform for sharing and synchronizing environment variables for local development between team members.

## Overview

**Env Team Vault** is designed to solve one specific problem: keeping your team's local `.env` files synchronized without sending them via Slack or email. It provides a central, secure, and audited place to manage the configuration variables that developers use on their local machines.

### Philosophy

- **Simplicity first**: This is not meant to compete with enterprise solutions like Doppler, Infisical, or HashiCorp Vault
- **Local development focus**: Specifically designed for development environment variables, not production secrets
- **Team collaboration**: Easy sharing and synchronization between team members
- **Self-hosted**: Full control over your data and deployment

## Features

- 🔐 **User Authentication**: Secure login/registration system with audit trails
- 📱 **Web Interface**: Clean, responsive web UI for managing applications and variables
- 🔑 **Application Management**: Create and organize multiple applications/projects
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
2. **Create Application**: Add a new application/project to manage
3. **Add Variables**: Define environment variables for your application
4. **Copy App ID**: Each application has a unique ID used for CLI access

### CLI Usage

Once you have an application set up with variables, you can sync them to your local development environment:

```bash
# Sync variables to your local .env file
npx env-team-vault sync <APP_ID> --url http://your-vault-url:3000

# Example
npx env-team-vault sync 123e4567-e89b-12d3-a456-426614174000 --url http://localhost:3000
```

This will fetch all variables for the specified application and write them to a `.env` file in your current directory.

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

## Security Considerations

- Application IDs serve as access tokens for the CLI API
- All user actions are logged for audit purposes
- Sessions are stored securely with configurable expiration
- Passwords are hashed using bcrypt
- The application is designed for trusted team environments

## Development

### Project Structure

```
/env-team-vault
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets (CSS, images)
├── src/
│   ├── core/              # Business logic and entities
│   │   ├── entities/      # Domain entities
│   │   ├── repositories/  # Repository interfaces
│   │   └── use-cases/     # Business use cases
│   ├── infra/             # Infrastructure layer
│   │   ├── auth/          # Authentication (Passport.js)
│   │   ├── database/      # Database repositories (Prisma)
│   │   ├── http/          # HTTP layer (controllers, routes)
│   │   └── web/           # Web templates (EJS)
│   └── main.ts            # Application entry point
├── docker-compose.yml     # Docker composition
├── Dockerfile            # Container definition
└── package.json          # Dependencies and scripts
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

- [ ] **SSO Integration**: Google and Microsoft OAuth support
- [ ] **CLI Package**: Standalone npm package for the CLI tool
- [ ] **Import/Export**: Bulk import/export of environment variables
- [ ] **Variable History**: Track changes to individual variables
- [ ] **Team Management**: Role-based access control
- [ ] **Webhooks**: Notifications for variable changes
- [ ] **API Keys**: Alternative authentication for CLI access

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/paladini/env-team-vault/wiki)
- 🐛 [Issue Tracker](https://github.com/paladini/env-team-vault/issues)
- 💬 [Discussions](https://github.com/paladini/env-team-vault/discussions)

---

Built with ❤️ for development teams who want a simple way to share environment variables.
