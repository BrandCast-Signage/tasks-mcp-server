# Claude Desktop Setup Guide

Complete guide to set up Google Tasks MCP Server with Claude Desktop.

---

## Prerequisites

- Node.js 18+ installed
- Claude Desktop installed
- Google account

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

Visit [Google Cloud Console](https://console.cloud.google.com/)

### 1.2 Create or Select a Project

- Click the project dropdown at the top
- Create a new project or select an existing one

### 1.3 Enable Google Tasks API

1. Navigate to **"APIs & Services"** → **"Library"**
2. Search for **"Tasks API"**
3. Click on it and press **"Enable"**

### 1.4 Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose "External" (unless you have a Google Workspace)
   - Fill in app name: "Google Tasks MCP"
   - Add your email
   - Skip optional fields
   - Add scope: `https://www.googleapis.com/auth/tasks`
   - Add yourself as a test user
4. Back on the credentials page:
   - Application type: **"Desktop app"**
   - Name: "Google Tasks MCP" (or any name)
5. Click **"Create"**
6. Copy the **Client ID** and **Client Secret**

---

## Step 2: Install the MCP Server

```bash
npm install -g @brandcast_app/google-tasks-mcp
```

Or use without installing:
```bash
npx @brandcast_app/google-tasks-mcp
```

---

## Step 3: Get Your Refresh Token

### 3.1 Set Environment Variables

```bash
export GOOGLE_CLIENT_ID="123456789-abc...apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="GOCSPX-abc123..."
```

**Windows (Command Prompt):**
```cmd
set GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
set GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
```

**Windows (PowerShell):**
```powershell
$env:GOOGLE_CLIENT_ID="123456789-abc...apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET="GOCSPX-abc123..."
```

### 3.2 Run the Auth Script

```bash
npm run auth
```

Or if installed globally:
```bash
google-tasks-mcp auth
```

This will:
1. Start a local web server on port 3000
2. Open your browser to Google's authorization page
3. Ask you to authorize the app
4. Capture the authorization code
5. Exchange it for tokens
6. Display your complete configuration

### 3.3 Copy the Configuration

The script will output something like:

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "npx",
      "args": ["-y", "@brandcast_app/google-tasks-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "...",
        "GOOGLE_REFRESH_TOKEN": "1//..."
      }
    }
  }
}
```

Copy this entire block.

---

## Step 4: Configure Claude Desktop

### 4.1 Open Config File

**macOS:**
```bash
code ~/.config/Claude/claude_desktop_config.json
# or
nano ~/.config/Claude/claude_desktop_config.json
```

**Linux:**
```bash
nano ~/.config/Claude/claude_desktop_config.json
```

**Windows:**
```
notepad %APPDATA%\Claude\claude_desktop_config.json
```

### 4.2 Add Configuration

Paste the configuration from Step 3.3. If the file already has content, merge it:

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "npx",
      "args": ["-y", "@brandcast_app/google-tasks-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "your_actual_client_id",
        "GOOGLE_CLIENT_SECRET": "your_actual_secret",
        "GOOGLE_REFRESH_TOKEN": "your_actual_refresh_token"
      }
    },
    "other-mcp-server": {
      ...
    }
  }
}
```

### 4.3 Save and Close

Make sure the JSON is valid (no trailing commas, proper quotes).

---

## Step 5: Restart Claude Desktop

**Important:** Completely quit Claude Desktop (not just close the window).

- **macOS:** Cmd+Q or Right-click icon → Quit
- **Windows:** Right-click taskbar icon → Close
- **Linux:** Quit via menu or kill process

Then relaunch Claude Desktop.

---

## Step 6: Verify Setup

In Claude Desktop, try asking:

> "What task management tools do you have access to?"

Claude should respond mentioning the Google Tasks MCP server.

Then try:

> "Show me my Google Tasks lists"

Claude should list your task lists.

---

## Troubleshooting

### "Server not found" or no MCP tools available

**Problem:** Claude doesn't see the MCP server

**Solutions:**
1. Check config file path is correct
2. Verify JSON syntax (use a JSON validator)
3. Make sure Claude Desktop was fully restarted
4. Check Claude Desktop logs:
   - Help → Developer Tools → Console
   - Look for MCP-related errors

### Authentication Errors

**Problem:** "Invalid credentials" or similar errors

**Solutions:**
1. Re-run `npm run auth` to get fresh tokens
2. Verify Client ID and Secret are correct
3. Make sure Tasks API is enabled
4. Check that you authorized the correct Google account

### "Command not found: google-tasks-mcp"

**Problem:** npm package not installed

**Solutions:**
1. Install globally: `npm install -g @brandcast_app/google-tasks-mcp`
2. Or use npx: `npx @brandcast_app/google-tasks-mcp`
3. Or use full path to node: `"command": "node", "args": ["/path/to/dist/index.js"]`

### Port 3000 Already in Use

**Problem:** Auth script can't start because port 3000 is busy

**Solutions:**
1. Kill the process using port 3000
2. Or edit `scripts/auth.ts` to use a different port

### Refresh Token Not Working

**Problem:** Server can't authenticate even with refresh token

**Solutions:**
1. Token may have expired - run `npm run auth` again
2. Check for typos in the refresh token
3. Verify the Client ID/Secret match the project that issued the token

---

## Advanced: Local Development

If you're developing the MCP server locally:

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "node",
      "args": ["/home/username/tasks-mcp-server/dist/index.js"],
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "...",
        "GOOGLE_REFRESH_TOKEN": "..."
      }
    }
  }
}
```

---

## Security Best Practices

1. **Never commit** your refresh token to git
2. **Don't share** your Client Secret publicly
3. **Use test users** in OAuth consent screen during development
4. **Revoke access** when done: [Google Account Permissions](https://myaccount.google.com/permissions)

---

## Next Steps

- [API Documentation](./API.md) - Learn what tools are available
- [Examples](./EXAMPLES.md) - See common usage patterns

---

Need help? [Open an issue](https://github.com/BrandCast-Signage/tasks-mcp-server/issues)
