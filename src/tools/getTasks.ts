import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus, type ProviderAuth, type TaskFilters } from '../types/index.js';

/**
 * MCP Tool: getTasks
 * Retrieve tasks from a specific list with optional filtering
 */
export const getTasksSchema = {
  name: 'getTasks',
  description: 'Retrieve tasks from a specific list with optional filtering',
  inputSchema: {
    type: 'object' as const,
    properties: {
      provider: {
        type: 'string',
        enum: Object.values(TaskProvider),
        description: 'Task provider',
      },
      listId: {
        type: 'string',
        description: 'ID of the task list to retrieve tasks from',
      },
      accessToken: {
        type: 'string',
        description: 'OAuth access token',
      },
      refreshToken: {
        type: 'string',
        description: 'OAuth refresh token (optional)',
      },
      filters: {
        type: 'object',
        description: 'Optional filters for tasks',
        properties: {
          status: {
            type: 'string',
            enum: Object.values(TaskStatus),
            description: 'Filter by task status',
          },
          search: {
            type: 'string',
            description: 'Text search in title/description',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of tasks to return',
          },
        },
      },
    },
    required: ['provider', 'listId', 'accessToken'],
  },
};

export async function handleGetTasks(args: {
  provider: string;
  listId: string;
  accessToken: string;
  refreshToken?: string;
  filters?: TaskFilters;
}) {
  const provider = providerRegistry.get(args.provider as TaskProvider);

  const auth: ProviderAuth = {
    provider: args.provider as TaskProvider,
    accessToken: args.accessToken,
    refreshToken: args.refreshToken,
  };

  const tasks = await provider.getTasks(auth, args.listId, args.filters);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ tasks, total: tasks.length }, null, 2),
    }],
  };
}
