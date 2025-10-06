import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
  type ListToolsRequest,
} from '@modelcontextprotocol/sdk/types.js';

// Import providers
import { GoogleTasksProvider, providerRegistry } from './providers/index.js';

// Import tool schemas and handlers
import {
  listProvidersSchema,
  handleListProviders,
  listTaskListsSchema,
  handleListTaskLists,
  getTasksSchema,
  handleGetTasks,
  createTaskSchema,
  handleCreateTask,
  updateTaskSchema,
  handleUpdateTask,
  completeTaskSchema,
  handleCompleteTask,
  deleteTaskSchema,
  handleDeleteTask,
  searchTasksSchema,
  handleSearchTasks,
  syncAllTasksSchema,
  handleSyncAllTasks,
} from './tools/index.js';

/**
 * Google Tasks MCP Server
 * Provides AI assistants with access to Google Tasks via MCP protocol
 */
export class TasksMCPServer {
  private server: Server;

  constructor() {
    // Create MCP server
    this.server = new Server(
      {
        name: 'google-tasks-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Register providers
    this.registerProviders();

    // Set up request handlers
    this.setupHandlers();

    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Register all task providers
   */
  private registerProviders() {
    providerRegistry.register(new GoogleTasksProvider());
  }

  /**
   * Set up MCP request handlers
   */
  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async (_request: ListToolsRequest) => {
      return {
        tools: [
          listProvidersSchema,
          listTaskListsSchema,
          getTasksSchema,
          createTaskSchema,
          updateTaskSchema,
          completeTaskSchema,
          deleteTaskSchema,
          searchTasksSchema,
          syncAllTasksSchema,
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
        case 'listProviders':
          return await handleListProviders();

        case 'listTaskLists':
          return await handleListTaskLists(args as Parameters<typeof handleListTaskLists>[0]);

        case 'getTasks':
          return await handleGetTasks(args as Parameters<typeof handleGetTasks>[0]);

        case 'createTask':
          return await handleCreateTask(args as Parameters<typeof handleCreateTask>[0]);

        case 'updateTask':
          return await handleUpdateTask(args as Parameters<typeof handleUpdateTask>[0]);

        case 'completeTask':
          return await handleCompleteTask(args as Parameters<typeof handleCompleteTask>[0]);

        case 'deleteTask':
          return await handleDeleteTask(args as Parameters<typeof handleDeleteTask>[0]);

        case 'searchTasks':
          return await handleSearchTasks(args as Parameters<typeof handleSearchTasks>[0]);

        case 'syncAllTasks':
          return await handleSyncAllTasks(args as Parameters<typeof handleSyncAllTasks>[0]);

        default:
          throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: errorMessage }, null, 2),
          }],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the MCP server
   */
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google Tasks MCP Server running on stdio');
  }
}
