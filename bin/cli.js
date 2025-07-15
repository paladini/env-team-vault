#!/usr/bin/env node

// Simple CLI for env-team-vault
const axios = require('axios');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');


const os = require('os');
const path = require('path');

const argv = yargs(hideBin(process.argv))
  .command('sync <appId>', 'Sync .env file', (yargs) => {
    yargs.positional('appId', {
      describe: 'Application ID',
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
    });
  })
  .help()
  .argv;


if (argv._[0] === 'sync') {
  const appId = argv.appId;
  const url = argv.url;
  let token = argv.token;
  // Try to get token from config file if not provided
  if (!token) {
    const configPath = path.join(os.homedir(), '.env-team-vaultrc');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const match = content.match(/API_TOKEN=(.*)/);
      if (match) token = match[1].trim();
    }
  }
  console.log(`🔄 Syncing .env file for app ID: ${appId} from ${url}`);
  axios.get(`${url}/api/vault/${appId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }
  )
    .then(res => {
      fs.writeFileSync('.env', res.data);
      console.log('✅ .env file synced!');
    })
    .catch(err => {
      console.error('❌ Failed to sync:', err.message);
      process.exit(1);
    });
}