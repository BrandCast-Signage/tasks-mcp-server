import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus, type ProviderAuth } from '../types/index.js';

/**
 * MCP Tool: completeTask
 * Mark a task as completed (convenience wrapper for updateTask)
 */
export const completeTaskSchema = {
  name: 'completeTask',
  description: 'Mark a task as completed',
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
        description: 'ID of the task to complete',
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

export async function handleCompleteTask(args: {
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

  const updatedTask = await provider.updateTask(auth, args.taskId, args.listId, {
    status: TaskStatus.COMPLETED,
    completedAt: new Date(),
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ task: updatedTask }, null, 2),
    }],
  };
}
