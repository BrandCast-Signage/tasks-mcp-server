import { providerRegistry } from '../providers/index.js';
import { TaskProvider, TaskStatus, type Task } from '../types/index.js';

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
      taskId: {
        type: 'string',
        description: 'ID of the task to update',
      },
      listId: {
        type: 'string',
        description: 'ID of the task list containing the task',
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
    required: ['taskId', 'listId', 'updates'],
  },
};

export async function handleUpdateTask(args: {
  taskId: string;
  listId: string;
  updates: {
    title?: string;
    description?: string;
    due?: string;
    status?: TaskStatus;
  };
}) {
  const provider = providerRegistry.get(TaskProvider.GOOGLE);

  // Convert updates
  const updates: Partial<Task> = {
    ...(args.updates.title !== undefined && { title: args.updates.title }),
    ...(args.updates.description !== undefined && { description: args.updates.description }),
    ...(args.updates.due !== undefined && { due: new Date(args.updates.due) }),
    ...(args.updates.status !== undefined && { status: args.updates.status }),
  };

  const updatedTask = await provider.updateTask(args.taskId, args.listId, updates);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ task: updatedTask }, null, 2),
    }],
  };
}
