# Hosting Guide for Administrators

## Overview
The `env-team-vault` platform is designed to be self-hosted, providing a secure and centralized way to manage environment variables for development teams.

## Prerequisites
- A Linux server with Docker installed.
- Node.js installed for local development.
- SQLite database (default configuration).

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/env-team-vault.git
cd env-team-vault
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:
```plaintext
NODE_ENV=production
PORT=3000
SESSION_SECRET=<your-session-secret>
DATABASE_URL="file:./prod.db"
```
- Replace `<your-session-secret>` with a strong, unique secret.

### Step 3: Build and Start the Application
Use Docker Compose to build and start the application:
```bash
docker-compose up -d
```

### Step 4: Generate API Tokens
Run the following command to generate API tokens for your team:
```bash
npm run generate-token -- <userId>
```

### Step 5: Share API Tokens
Distribute the generated API tokens securely to your team members.

## Security Best Practices
- Use HTTPS for the vault server.
- Rotate API tokens periodically.
- Restrict access to the `.env-team-vaultrc` file.
- Monitor audit logs for suspicious activity.

## Maintenance
- Regularly back up the SQLite database.
- Update the application periodically to receive security patches.

## Troubleshooting
- **401 Unauthorized**: Ensure the API token is valid and not revoked.
- **500 Internal Server Error**: Check the server logs for detailed error messages.

## Contact
For further assistance, contact the development team at support@your-org.com.
