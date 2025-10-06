import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus } from '../types/index.js';

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
      taskId: {
        type: 'string',
        description: 'ID of the task to complete',
      },
      listId: {
        type: 'string',
        description: 'ID of the task list containing the task',
      },
    },
    required: ['taskId', 'listId'],
  },
};

export async function handleCompleteTask(args: {
  taskId: string;
  listId: string;
}) {
  const provider = providerRegistry.get(TaskProvider.GOOGLE);

  const updatedTask = await provider.updateTask(args.taskId, args.listId, {
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
