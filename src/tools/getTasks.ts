import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus, type TaskFilters } from '../types/index.js';

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
      listId: {
        type: 'string',
        description: 'ID of the task list to retrieve tasks from',
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
    required: ['listId'],
  },
};

export async function handleGetTasks(args: {
  listId: string;
  filters?: TaskFilters;
}) {
  const provider = providerRegistry.get(TaskProvider.GOOGLE);
  const tasks = await provider.getTasks(args.listId, args.filters);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ tasks, total: tasks.length }, null, 2),
    }],
  };
}
