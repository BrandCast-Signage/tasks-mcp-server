# Google Tasks MCP Server

<p align="center">
  <strong>Model Context Protocol (MCP) server for Google Tasks</strong><br>
  Enable AI assistants like Claude to manage your Google Tasks
</p>

---

## 🚀 Quick Start

### Installation

```bash
npm install -g @brandcast/google-tasks-mcp
```

### Claude Desktop Configuration

Add to `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "npx",
      "args": ["-y", "@brandcast/google-tasks-mcp"]
    }
  }
}
```

---

## 📋 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- ✅ **List Management** - Work with multiple task lists
- ✅ **AI-Ready** - Native MCP protocol support for Claude
- ✅ **Type-Safe** - Written in TypeScript with full type definitions
- ✅ **OAuth 2.0** - Secure authentication with Google

---

## 🛠️ Available Tools

The MCP server exposes 9 tools for managing Google Tasks:

1. **listProviders** - Get available task providers
2. **listTaskLists** - Get all task lists
3. **getTasks** - Retrieve tasks from a list
4. **createTask** - Create a new task
5. **updateTask** - Update an existing task
6. **completeTask** - Mark a task as complete
7. **deleteTask** - Delete a task
8. **searchTasks** - Search across all lists
9. **syncAllTasks** - Sync tasks from multiple providers

---

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Authentication Guide](./docs/AUTHENTICATION.md)
- [Examples](./docs/EXAMPLES.md)

---

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/BrandCast-Signage/tasks-mcp-server.git
cd tasks-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👥 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Google Tasks API](https://developers.google.com/tasks)
- [BrandCast](https://brandcast.app) - Digital signage platform

---

**Status:** 🚧 In Development

This is an MVP implementation focusing on Google Tasks. Future versions will add support for Cozi, Todoist, Microsoft To Do, and Apple Reminders.
