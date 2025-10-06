import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus, type ProviderAuth, type TaskFilters } from '../types/index.js';

/**
 * MCP Tool: searchTasks
 * Search across all lists in a provider
 */
export const searchTasksSchema = {
  name: 'searchTasks',
  description: 'Search tasks across all lists in a provider',
  inputSchema: {
    type: 'object' as const,
    properties: {
      provider: {
        type: 'string',
        enum: Object.values(TaskProvider),
        description: 'Task provider',
      },
      query: {
        type: 'string',
        description: 'Search query text',
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
        description: 'Optional additional filters',
        properties: {
          status: {
            type: 'string',
            enum: Object.values(TaskStatus),
            description: 'Filter by task status',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of tasks to return',
          },
        },
      },
    },
    required: ['provider', 'query', 'accessToken'],
  },
};

export async function handleSearchTasks(args: {
  provider: string;
  query: string;
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

  const tasks = await provider.searchTasks(auth, args.query, args.filters);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ tasks, total: tasks.length }, null, 2),
    }],
  };
}
