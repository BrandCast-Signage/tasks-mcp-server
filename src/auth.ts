#!/usr/bin/env node

/**
 * OAuth Authentication Script
 * Run: npm run auth
 *
 * This script guides users through Google OAuth and outputs a refresh token
 * that can be added to their Claude Desktop configuration.
 */

import { google } from 'googleapis';
import * as http from 'http';
import { URL } from 'url';

const SCOPES = ['https://www.googleapis.com/auth/tasks'];
const REDIRECT_URI = 'http://localhost:3000/oauth/callback';

async function authenticate() {
  console.log('\n🔐 Google Tasks MCP - OAuth Setup\n');
  console.log('This script will help you authenticate with Google Tasks.\n');

  // Get credentials from environment or prompt
  const clientId = process.env['GOOGLE_CLIENT_ID'];
  const clientSecret = process.env['GOOGLE_CLIENT_SECRET'];

  if (!clientId || !clientSecret) {
    console.error('❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set.');
    console.error('\nPlease set these environment variables and try again:');
    console.error('  export GOOGLE_CLIENT_ID="your_client_id"');
    console.error('  export GOOGLE_CLIENT_SECRET="your_client_secret"');
    console.error('\nSee README.md for instructions on getting these credentials.');
    process.exit(1);
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    REDIRECT_URI
  );

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force to get refresh token
  });

  console.log('📝 Step 1: Authorize this app');
  console.log('\nPlease visit this URL to authorize:\n');
  console.log(authUrl);
  console.log('\n');

  // Start local server to capture callback
  const tokens = await startCallbackServer(oauth2Client);

  if (!tokens.refresh_token) {
    console.error('\n❌ Error: No refresh token received.');
    console.error('This can happen if you\'ve already authorized this app.');
    console.error('Try revoking access at https://myaccount.google.com/permissions');
    process.exit(1);
  }

  console.log('\n✅ Authentication successful!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 Add this to your Claude Desktop configuration:\n');
  console.log('File: ~/.config/Claude/claude_desktop_config.json\n');
  console.log(JSON.stringify({
    mcpServers: {
      'google-tasks': {
        command: 'npx',
        args: ['-y', '@brandcast_app/google-tasks-mcp'],
        env: {
          GOOGLE_CLIENT_ID: clientId,
          GOOGLE_CLIENT_SECRET: clientSecret,
          GOOGLE_REFRESH_TOKEN: tokens.refresh_token,
        },
      },
    },
  }, null, 2));
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💡 Restart Claude Desktop for the changes to take effect.\n');
}

function startCallbackServer(oauth2Client: InstanceType<typeof google.auth.OAuth2>): Promise<{
  access_token?: string | null;
  refresh_token?: string | null;
}> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        if (!req.url) {
          return;
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        if (url.pathname === '/oauth/callback') {
          const code = url.searchParams.get('code');

          if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>Error: No authorization code received</h1>');
            server.close();
            reject(new Error('No authorization code'));
            return;
          }

          // Exchange code for tokens
          const { tokens } = await oauth2Client.getToken(code);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head><title>Authentication Successful</title></head>
              <body style="font-family: system-ui; max-width: 600px; margin: 100px auto; text-align: center;">
                <h1 style="color: #22c55e;">✅ Authentication Successful!</h1>
                <p>You can close this window and return to your terminal.</p>
              </body>
            </html>
          `);

          server.close();
          resolve(tokens);
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Error during authentication</h1>');
        server.close();
        reject(error);
      }
    });

    server.listen(3000, () => {
      console.log('🌐 Waiting for authorization... (callback server listening on port 3000)');
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authentication timeout'));
    }, 5 * 60 * 1000);
  });
}

// Run authentication
authenticate().catch((error) => {
  console.error('\n❌ Authentication failed:', error.message);
  process.exit(1);
});
