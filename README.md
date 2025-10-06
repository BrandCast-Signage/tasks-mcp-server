# Google Tasks MCP Server

<p align="center">
  <strong>Model Context Protocol (MCP) server for Google Tasks</strong><br>
  Enable AI assistants like Claude to manage your Google Tasks
</p>

---

## 🚀 Quick Start

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Tasks API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Tasks API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Desktop app" as the application type
   - Name it "Google Tasks MCP" (or whatever you prefer)
   - Click "Create"
5. Download or copy the **Client ID** and **Client Secret**

### 2. Install the Package

```bash
npm install -g @brandcast_app/google-tasks-mcp
```

### 3. Get Your Refresh Token

Run the authentication script:

```bash
# Set your credentials
export GOOGLE_CLIENT_ID="your_client_id_here"
export GOOGLE_CLIENT_SECRET="your_client_secret_here"

# Run auth flow
npx @brandcast_app/google-tasks-mcp auth
```

This will:
1. Open your browser
2. Ask you to authorize the app
3. Display your configuration to copy

### 4. Configure Claude Desktop

Add to your config file:

**macOS/Linux:** `~/.config/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "npx",
      "args": ["-y", "@brandcast_app/google-tasks-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "your_client_id_here",
        "GOOGLE_CLIENT_SECRET": "your_client_secret_here",
        "GOOGLE_REFRESH_TOKEN": "your_refresh_token_here"
      }
    }
  }
}
```

### 5. Restart Claude Desktop

Completely quit and relaunch Claude Desktop.

---

## 📋 Available Tools

Ask Claude to:

- **"Show my task lists"** - List all your Google Tasks lists
- **"Show tasks from [list name]"** - Get tasks from a specific list
- **"Create a task 'Buy milk' in my Shopping list"** - Create new tasks
- **"Mark task [id] as complete"** - Complete tasks
- **"Search for tasks about 'report'"** - Search across all lists
- **"Show me all my tasks"** - Sync all tasks from all lists

The MCP server provides 9 tools:
1. `listProviders` - Get available providers
2. `listTaskLists` - Get all task lists
3. `getTasks` - Get tasks from a list
4. `createTask` - Create a new task
5. `updateTask` - Update existing task
6. `completeTask` - Mark task complete
7. `deleteTask` - Delete a task
8. `searchTasks` - Search across lists
9. `syncAllTasks` - Get all tasks

---

## 🔧 Development

### Local Setup

```bash
# Clone the repository
git clone https://github.com/BrandCast-Signage/tasks-mcp-server.git
cd tasks-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run auth flow
export GOOGLE_CLIENT_ID="your_id"
export GOOGLE_CLIENT_SECRET="your_secret"
npm run auth
```

### Testing Locally

Update Claude Desktop config to use local build:

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "node",
      "args": ["/absolute/path/to/tasks-mcp-server/dist/index.js"],
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

## 📖 Documentation

- [API Documentation](./docs/API.md) - Complete tool reference
- [Claude Desktop Setup](./docs/CLAUDE_DESKTOP_SETUP.md) - Detailed setup guide

---

## 🔐 Security Notes

- Tokens are stored only in Claude Desktop's config file
- Refresh tokens are used to automatically get new access tokens
- The MCP server doesn't persist any credentials to disk
- All communication happens locally via stdio

---

## 🐛 Troubleshooting

### "Provider not found" error
- Make sure Claude Desktop is completely restarted
- Check the config file path is correct
- Verify JSON syntax is valid

### Authentication errors
- Run `npm run auth` again to get a fresh refresh token
- Make sure Client ID and Secret match your Google Cloud project
- Verify the Tasks API is enabled in Google Cloud Console

### "Command not found"  
- Make sure the package is installed: `npm install -g @brandcast_app/google-tasks-mcp`
- Or use npx: `npx @brandcast_app/google-tasks-mcp`

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👥 Contributing

Contributions welcome! Please open an issue or PR.

---

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Google Tasks API](https://developers.google.com/tasks)
- [BrandCast](https://brandcast.app) - Digital signage platform

---

**Author:** Jamie Duncan ([@BrandCast-Signage](https://github.com/BrandCast-Signage))

**Version:** 0.1.0 (MVP - Google Tasks only)
