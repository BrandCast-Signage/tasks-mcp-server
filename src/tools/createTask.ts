import { providerRegistry } from '../providers/index.js';
import { TaskProvider, type ProviderAuth, type Task } from '../types/index.js';

/**
 * MCP Tool: createTask
 * Create a new task in a specific list
 */
export const createTaskSchema = {
  name: 'createTask',
  description: 'Create a new task in a specific list',
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
        description: 'ID of the task list to create task in',
      },
      accessToken: {
        type: 'string',
        description: 'OAuth access token',
      },
      refreshToken: {
        type: 'string',
        description: 'OAuth refresh token (optional)',
      },
      task: {
        type: 'object',
        description: 'Task data',
        properties: {
          title: {
            type: 'string',
            description: 'Task title (required)',
          },
          description: {
            type: 'string',
            description: 'Task description/notes',
          },
          due: {
            type: 'string',
            description: 'Due date in ISO 8601 format (e.g., 2025-10-10T17:00:00Z)',
          },
        },
        required: ['title'],
      },
    },
    required: ['provider', 'listId', 'accessToken', 'task'],
  },
};

export async function handleCreateTask(args: {
  provider: string;
  listId: string;
  accessToken: string;
  refreshToken?: string;
  task: {
    title: string;
    description?: string;
    due?: string;
  };
}) {
  const provider = providerRegistry.get(args.provider as TaskProvider);

  const auth: ProviderAuth = {
    provider: args.provider as TaskProvider,
    accessToken: args.accessToken,
    refreshToken: args.refreshToken,
  };

  // Convert task data
  const taskData: Partial<Task> = {
    title: args.task.title,
    description: args.task.description,
    due: args.task.due ? new Date(args.task.due) : undefined,
  };

  const createdTask = await provider.createTask(auth, args.listId, taskData);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ task: createdTask }, null, 2),
    }],
  };
}
