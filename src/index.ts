#!/usr/bin/env node

import { TasksMCPServer } from './server.js';

/**
 * Main entry point for the Google Tasks MCP Server
 */
async function main() {
  try {
    const server = new TasksMCPServer();
    await server.start();
  } catch (error) {
    console.error('Failed to start Google Tasks MCP Server:', error);
    process.exit(1);
  }
}

main();
