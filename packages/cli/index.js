#!/usr/bin/env node

// CLI for env-team-vault
const axios = require('axios');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const os = require('os');
const path = require('path');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command('sync <appId>', 'Sync .env file from your vault', (yargs) => {
    yargs.positional('appId', {
      describe: 'Application ID from your env-team-vault',
      type: 'string'
    })
    .option('url', {
      describe: 'Vault server URL',
      type: 'string',
      demandOption: true
    })
    .option('token', {
      describe: 'Auth API Token',
      type: 'string'
    })
    .option('output', {
      describe: 'Output file path',
      type: 'string',
      default: '.env'
    });
  })
  .command('config', 'Set or view configuration', (yargs) => {
    yargs.option('token', {
      describe: 'Set API token for authentication',
      type: 'string'
    })
    .option('url', {
      describe: 'Set default vault server URL',
      type: 'string'
    });
  })
  .example('$0 sync abc123 --url https://env-vault.mycompany.com', 'Sync .env file for app ID abc123')
  .example('$0 config --token myToken --url https://env-vault.mycompany.com', 'Set default configuration')
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .demandCommand(1, 'You need to specify a command')
  .epilog('For more information, visit https://github.com/paladini/env-team-vault')
  .argv;

// Configuration file path
const CONFIG_PATH = path.join(os.homedir(), '.env-team-vaultrc');

// Handle config command
if (argv._[0] === 'config') {
  // Load existing config
  let config = {};
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const content = fs.readFileSync(CONFIG_PATH, 'utf8');
      const lines = content.split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          config[match[1]] = match[2].trim();
        }
      });
    } catch (error) {
      console.error('Error reading config file:', error.message);
    }
  }

  // Update config with new values
  if (argv.token) {
    config.API_TOKEN = argv.token;
  }
  if (argv.url) {
    config.DEFAULT_URL = argv.url;
  }

  // If no new values, just show current config
  if (!argv.token && !argv.url) {
    console.log('Current configuration:');
    console.log(config);
    process.exit(0);
  }

  // Save config
  try {
    let content = '';
    Object.entries(config).forEach(([key, value]) => {
      content += `${key}=${value}\n`;
    });
    fs.writeFileSync(CONFIG_PATH, content);
    console.log('✅ Configuration saved successfully');
  } catch (error) {
    console.error('❌ Error saving configuration:', error.message);
    process.exit(1);
  }
}

// Handle sync command
if (argv._[0] === 'sync') {
  const appId = argv.appId;
  let url = argv.url;
  let token = argv.token;
  const outputFile = argv.output || '.env';

  // Try to get token and url from config file if not provided
  if (!token || !url) {
    if (fs.existsSync(CONFIG_PATH)) {
      try {
        const content = fs.readFileSync(CONFIG_PATH, 'utf8');
        if (!token) {
          const tokenMatch = content.match(/API_TOKEN=(.*)/);
          if (tokenMatch) token = tokenMatch[1].trim();
        }
        if (!url) {
          const urlMatch = content.match(/DEFAULT_URL=(.*)/);
          if (urlMatch) url = urlMatch[1].trim();
        }
      } catch (error) {
        console.error('Error reading config file:', error.message);
      }
    }
  }

  if (!url) {
    console.error('❌ Vault server URL is required. Provide it with --url or set it in config.');
    process.exit(1);
  }

  console.log(`🔄 Syncing .env file for app ID: ${appId} from ${url}`);
  
  // Make sure URL doesn't end with a slash
  url = url.replace(/\/$/, '');
  
  axios.get(`${url}/api/vault/${appId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
    .then(res => {
      fs.writeFileSync(outputFile, res.data);
      console.log(`✅ Environment variables synced to ${outputFile}!`);
    })
    .catch(err => {
      if (err.response) {
        console.error(`❌ Server error (${err.response.status}): ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        console.error('❌ No response from server. Please check the URL and your connection.');
      } else {
        console.error('❌ Failed to sync:', err.message);
      }
      process.exit(1);
    });
}