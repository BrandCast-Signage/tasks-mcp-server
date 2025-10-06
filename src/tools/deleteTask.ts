import { providerRegistry } from '../providers/index.js';
import { TaskProvider, type ProviderAuth } from '../types/index.js';

/**
 * MCP Tool: deleteTask
 * Delete a task permanently
 */
export const deleteTaskSchema = {
  name: 'deleteTask',
  description: 'Delete a task permanently',
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
        description: 'ID of the task to delete',
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
    },
    required: ['provider', 'taskId', 'listId', 'accessToken'],
  },
};

export async function handleDeleteTask(args: {
  provider: string;
  taskId: string;
  listId: string;
  accessToken: string;
  refreshToken?: string;
}) {
  const provider = providerRegistry.get(args.provider as TaskProvider);

  const auth: ProviderAuth = {
    provider: args.provider as TaskProvider,
    accessToken: args.accessToken,
    refreshToken: args.refreshToken,
  };

  await provider.deleteTask(auth, args.taskId, args.listId);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ success: true, deletedId: args.taskId }, null, 2),
    }],
  };
}
