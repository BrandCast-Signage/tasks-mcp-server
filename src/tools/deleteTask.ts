import { providerRegistry } from '../providers/index.js';
import { TaskProvider } from '../types/index.js';

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
      taskId: {
        type: 'string',
        description: 'ID of the task to delete',
      },
      listId: {
        type: 'string',
        description: 'ID of the task list containing the task',
      },
    },
    required: ['taskId', 'listId'],
  },
};

export async function handleDeleteTask(args: {
  taskId: string;
  listId: string;
}) {
  const provider = providerRegistry.get(TaskProvider.GOOGLE);
  await provider.deleteTask(args.taskId, args.listId);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ success: true, deletedId: args.taskId }, null, 2),
    }],
  };
}
