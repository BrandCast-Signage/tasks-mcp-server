import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus, type TaskFilters } from '../types/index.js';

/**
 * MCP Tool: searchTasks
 * Search across all lists
 */
export const searchTasksSchema = {
  name: 'searchTasks',
  description: 'Search tasks across all lists in Google Tasks',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'Search query text',
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
    required: ['query'],
  },
};

export async function handleSearchTasks(args: {
  query: string;
  filters?: TaskFilters;
}) {
  const provider = providerRegistry.get(TaskProvider.GOOGLE);
  const tasks = await provider.searchTasks(args.query, args.filters);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ tasks, total: tasks.length }, null, 2),
    }],
  };
}
