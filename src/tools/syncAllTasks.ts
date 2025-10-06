import { providerRegistry } from '../providers/index.js';
import { TaskProvider, type Task, type TaskFilters } from '../types/index.js';

/**
 * MCP Tool: syncAllTasks
 * Fetch tasks from all lists in Google Tasks
 */
export const syncAllTasksSchema = {
  name: 'syncAllTasks',
  description: 'Fetch and sync tasks from all lists in Google Tasks',
  inputSchema: {
    type: 'object' as const,
    properties: {
      filters: {
        type: 'object',
        description: 'Optional filters to apply',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by task status',
          },
          limit: {
            type: 'number',
            description: 'Maximum total tasks to return',
          },
        },
      },
    },
  },
};

export async function handleSyncAllTasks(args?: {
  filters?: TaskFilters;
}) {
  const provider = providerRegistry.get(TaskProvider.GOOGLE);
  const allTasks: Task[] = [];

  try {
    const lists = await provider.getTaskLists();

    for (const list of lists) {
      try {
        const tasks = await provider.getTasks(list.id, args?.filters);
        allTasks.push(...tasks);
      } catch (error) {
        console.error('Failed to fetch tasks from list:', error);
      }
    }

    let tasks = allTasks;
    if (args?.filters?.limit && args.filters.limit > 0) {
      tasks = allTasks.slice(0, args.filters.limit);
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          tasks,
          total: tasks.length,
          listsProcessed: lists.length,
        }, null, 2),
      }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error('Failed to sync tasks: ' + errorMessage);
  }
}
