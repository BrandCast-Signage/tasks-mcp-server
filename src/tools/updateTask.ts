import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus, type ProviderAuth, type Task } from '../types/index.js';

/**
 * MCP Tool: updateTask
 * Update an existing task
 */
export const updateTaskSchema = {
  name: 'updateTask',
  description: 'Update an existing task',
  inputSchema: {
    type: 'object' as const,
    properties: {
      provider: {
        type: 'string',
        enum: Object.values(TaskProvider),
        description: 'Task provider',
      },
      taskId: {
        type: 'string',
        description: 'ID of the task to update',
      },
      listId: {
        type: 'string',
        description: 'ID of the task list containing the task',
      },
      accessToken: {
        type: 'string',
        description: 'OAuth access token',
      },
      refreshToken: {
        type: 'string',
        description: 'OAuth refresh token (optional)',
      },
      updates: {
        type: 'object',
        description: 'Fields to update',
        properties: {
          title: {
            type: 'string',
            description: 'New task title',
          },
          description: {
            type: 'string',
            description: 'New task description',
          },
          due: {
            type: 'string',
            description: 'New due date in ISO 8601 format',
          },
          status: {
            type: 'string',
            enum: Object.values(TaskStatus),
            description: 'New task status',
          },
        },
      },
    },
    required: ['provider', 'taskId', 'listId', 'accessToken', 'updates'],
  },
};

export async function handleUpdateTask(args: {
  provider: string;
  taskId: string;
  listId: string;
  accessToken: string;
  refreshToken?: string;
  updates: {
    title?: string;
    description?: string;
    due?: string;
    status?: TaskStatus;
  };
}) {
  const provider = providerRegistry.get(args.provider as TaskProvider);

  const auth: ProviderAuth = {
    provider: args.provider as TaskProvider,
    accessToken: args.accessToken,
    refreshToken: args.refreshToken,
  };

  // Convert updates
  const updates: Partial<Task> = {
    ...(args.updates.title !== undefined && { title: args.updates.title }),
    ...(args.updates.description !== undefined && { description: args.updates.description }),
    ...(args.updates.due !== undefined && { due: new Date(args.updates.due) }),
    ...(args.updates.status !== undefined && { status: args.updates.status }),
  };

  const updatedTask = await provider.updateTask(auth, args.taskId, args.listId, updates);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ task: updatedTask }, null, 2),
    }],
  };
}
