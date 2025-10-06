import { providerRegistry } from '../providers/index.js';
import { TaskProvider, type Task, type ProviderAuth, type TaskFilters } from '../types/index.js';

/**
 * MCP Tool: syncAllTasks
 * Fetch tasks from multiple providers and merge
 */
export const syncAllTasksSchema = {
  name: 'syncAllTasks',
  description: 'Fetch and sync tasks from multiple providers',
  inputSchema: {
    type: 'object' as const,
    properties: {
      providers: {
        type: 'array',
        description: 'Array of provider configurations',
        items: {
          type: 'object',
          properties: {
            provider: {
              type: 'string',
              enum: Object.values(TaskProvider),
              description: 'Task provider',
            },
            accessToken: {
              type: 'string',
              description: 'OAuth access token',
            },
            refreshToken: {
              type: 'string',
              description: 'OAuth refresh token (optional)',
            },
            listIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional: specific list IDs to sync (if empty, sync all)',
            },
          },
          required: ['provider', 'accessToken'],
        },
      },
      filters: {
        type: 'object',
        description: 'Optional filters to apply to all providers',
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
    required: ['providers'],
  },
};

export async function handleSyncAllTasks(args: {
  providers: Array<{
    provider: string;
    accessToken: string;
    refreshToken?: string;
    listIds?: string[];
  }>;
  filters?: TaskFilters;
}) {
  const allTasks: Task[] = [];
  const byProvider: Record<string, number> = {};

  // Fetch tasks from each provider
  for (const providerConfig of args.providers) {
    try {
      const provider = providerRegistry.get(providerConfig.provider as TaskProvider);

      const auth: ProviderAuth = {
        provider: providerConfig.provider as TaskProvider,
        accessToken: providerConfig.accessToken,
        refreshToken: providerConfig.refreshToken,
      };

      // Get all lists for this provider
      const lists = await provider.getTaskLists(auth);

      // Filter lists if specific IDs provided
      const listsToSync = providerConfig.listIds && providerConfig.listIds.length > 0
        ? lists.filter(list => providerConfig.listIds!.includes(list.id))
        : lists;

      // Fetch tasks from each list
      for (const list of listsToSync) {
        try {
          const tasks = await provider.getTasks(auth, list.id, args.filters);
          allTasks.push(...tasks);
          byProvider[providerConfig.provider] = (byProvider[providerConfig.provider] || 0) + tasks.length;
        } catch (error) {
          // Continue with other lists if one fails
          console.error(`Failed to fetch tasks from list ${list.name}:`, error);
        }
      }
    } catch (error) {
      // Continue with other providers if one fails
      console.error(`Failed to sync provider ${providerConfig.provider}:`, error);
    }
  }

  // Apply global limit if specified
  let tasks = allTasks;
  if (args.filters?.limit && args.filters.limit > 0) {
    tasks = allTasks.slice(0, args.filters.limit);
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        tasks,
        total: tasks.length,
        byProvider,
      }, null, 2),
    }],
  };
}
