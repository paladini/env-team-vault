# User Guide for Developers

## Overview
The `env-team-vault` platform allows developers to synchronize their local `.env` files with a centralized vault. This eliminates the need to share `.env` files manually via email or messaging platforms.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- Access to the vault server URL.
- An API token provided by your team administrator.

### Installation
1. Install the CLI tool:
   ```bash
   npm install -g env-team-vault
   ```

2. Configure your API token:
   Create a file named `.env-team-vaultrc` in your home directory:
   ```plaintext
   API_TOKEN=<your-api-token>
   ```

### Syncing Your `.env` File
Run the following command to sync your `.env` file:
```bash
env-team-vault sync <appId> --url <vault-server-url>
```
- Replace `<appId>` with your application ID.
- Replace `<vault-server-url>` with the URL of the vault server.

The CLI will fetch the environment variables and overwrite your local `.env` file.

### Example
```bash
env-team-vault sync 96a48c56-0e90-4e02-b787-8984cfb8e5cb --url http://localhost:3000
```

## Troubleshooting
- **401 Unauthorized**: Ensure your API token is valid and not revoked.
- **404 Application Not Found**: Verify the application ID provided.
- **500 Internal Server Error**: Contact your administrator for assistance.

## Security Notes
- Never share your API token publicly.
- Ensure your `.env-team-vaultrc` file is not accessible to unauthorized users.
