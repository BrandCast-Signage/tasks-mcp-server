# Pre-Publish Checklist ✅

## 1. Verify Build
- [x] Clean build successful
- [x] Auth script compiled to dist/auth.js
- [x] Shebang present in bin files
- [x] Type checking passes

## 2. Package Configuration
- [x] Package name: @brandcast/google-tasks-mcp
- [x] Version: 0.1.0
- [x] Main entry: dist/index.js
- [x] Bin commands: google-tasks-mcp, google-tasks-mcp-auth
- [x] Files included: dist, README.md, LICENSE

## 3. Ready to Publish!

### Commands to run:

```bash
# 1. Login to npm (if not already)
npm login

# 2. Publish (prepublishOnly will run automatically)
npm publish --access public

# 3. Verify publication
npm view @brandcast/google-tasks-mcp
```

### After Publishing:

Test installation:
```bash
npm install -g @brandcast/google-tasks-mcp

# Test auth command
export GOOGLE_CLIENT_ID="your_id"
export GOOGLE_CLIENT_SECRET="your_secret"
google-tasks-mcp-auth
```

Configure Claude Desktop with published package:
```json
{
  "mcpServers": {
    "google-tasks": {
      "command": "npx",
      "args": ["-y", "@brandcast/google-tasks-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "...",
        "GOOGLE_CLIENT_SECRET": "...",
        "GOOGLE_REFRESH_TOKEN": "..."
      }
    }
  }
}
```
