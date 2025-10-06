# Claude Desktop Setup Guide

This guide will help you set up the Google Tasks MCP Server with Claude Desktop.

## Prerequisites

1. **Node.js 18+** installed
2. **Google OAuth credentials** (see [Authentication Setup](./AUTHENTICATION.md))
3. **Claude Desktop** installed

## Installation

### Option 1: From npm (Recommended)

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "npx",
      "args": ["-y", "@brandcast/google-tasks-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "your_client_id_here",
        "GOOGLE_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

### Option 2: From Local Build

If you've cloned and built the repository:

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "node",
      "args": ["/absolute/path/to/tasks-mcp-server/dist/index.js"],
      "env": {
        "GOOGLE_CLIENT_ID": "your_client_id_here",
        "GOOGLE_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

## Configuration

1. **Get Google OAuth Credentials**
   - Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new OAuth 2.0 Client ID
   - Set authorized redirect URIs appropriately
   - Copy the Client ID and Client Secret

2. **Update Config**
   - Replace `your_client_id_here` with your Google Client ID
   - Replace `your_client_secret_here` with your Google Client Secret

3. **Restart Claude Desktop**
   - Completely quit Claude Desktop
   - Relaunch the application

## Verifying Setup

Once configured, you should be able to ask Claude:

> "What task management providers are available?"

Claude should respond with information about the Google Tasks provider.

## Getting OAuth Tokens

To use the MCP tools, you'll need OAuth access tokens. There are several ways to obtain these:

### Option 1: Using BrandCast (if you have access)

If you're a BrandCast user, you can authenticate via the BrandCast application and use those tokens.

### Option 2: Using Google OAuth Playground

1. Visit [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) and enable "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. Select "Tasks API v1" scopes
5. Authorize and exchange authorization code for tokens
6. Copy the access token and refresh token

### Option 3: Implement your own OAuth flow

See [AUTHENTICATION.md](./AUTHENTICATION.md) for details on implementing OAuth 2.0 flow.

## Usage Examples

Once you have tokens, you can ask Claude:

```
"Get my Google Tasks lists"
Provider: google
Access Token: ya29.a0Aa...
```

```
"Show me tasks from my 'Work' list"
Provider: google
List ID: MTIzNDU2...
Access Token: ya29.a0Aa...
```

```
"Create a task 'Buy groceries' in my Shopping list"
Provider: google
List ID: ABC123...
Access Token: ya29.a0Aa...
Title: Buy groceries
Due: 2025-10-10
```

## Troubleshooting

### Server not appearing in Claude

- Check Claude Desktop logs
- Verify the config file path is correct
- Ensure JSON syntax is valid
- Try restarting Claude Desktop

### Authentication errors

- Verify Client ID and Secret are correct
- Check token hasn't expired
- Ensure proper scopes are granted

### "Provider not found" errors

- The server is running but Google provider didn't register
- Check server logs for startup errors
- Verify googleapis package is installed

## Next Steps

- [API Documentation](./API.md) - Full tool reference
- [Examples](./EXAMPLES.md) - Common usage patterns
- [Authentication Guide](./AUTHENTICATION.md) - Detailed auth setup
