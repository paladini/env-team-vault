# env-team-vault

A simple CLI tool to sync environment variables from your self-hosted env-team-vault server.

## Installation

```bash
npm install -g env-team-vault
```

## Usage

### Sync environment variables

```bash
# Sync .env file from your vault
env-team-vault sync <appId> --url https://your-vault-server.com

# With authentication token
env-team-vault sync <appId> --url https://your-vault-server.com --token your-api-token

# Specify output file
env-team-vault sync <appId> --url https://your-vault-server.com --output .env.development
```

### Set configuration

You can set default configuration to avoid typing the same parameters each time:

```bash
# Set API token and default URL
env-team-vault config --token your-api-token --url https://your-vault-server.com

# View current configuration
env-team-vault config
```

## Configuration

The CLI stores configuration in `~/.env-team-vaultrc` file. You can edit this file manually if needed:

```
API_TOKEN=your-api-token
DEFAULT_URL=https://your-vault-server.com
```

## Options

- `sync <appId>`: Sync environment variables for the specified application ID
  - `--url`: Vault server URL (required if not set in config)
  - `--token`: API token for authentication
  - `--output`: Output file path (default: `.env`)

- `config`: Set or view configuration
  - `--token`: Set API token for authentication
  - `--url`: Set default vault server URL

## About env-team-vault

env-team-vault is a self-hosted platform for securely sharing and synchronizing environment variables for local development among team members. It provides a central, secure, and audited location for managing development environment configurations.

For more information, visit [https://github.com/paladini/env-team-vault](https://github.com/paladini/env-team-vault)