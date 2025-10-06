import { providerRegistry } from '../providers/index.js';
import { TaskProvider, type ProviderAuth } from '../types/index.js';

/**
 * MCP Tool: listTaskLists
 * Get all task lists/projects for a provider
 */
export const listTaskListsSchema = {
  name: 'listTaskLists',
  description: 'Get all task lists/projects for a specific provider',
  inputSchema: {
    type: 'object' as const,
    properties: {
      provider: {
        type: 'string',
        enum: Object.values(TaskProvider),
        description: 'Task provider (e.g., google, cozi, todoist)',
      },
      accessToken: {
        type: 'string',
        description: 'OAuth access token for the provider',
      },
      refreshToken: {
        type: 'string',
        description: 'OAuth refresh token (optional)',
      },
    },
    required: ['provider', 'accessToken'],
  },
};

export async function handleListTaskLists(args: {
  provider: string;
  accessToken: string;
  refreshToken?: string;
}) {
  const provider = providerRegistry.get(args.provider as TaskProvider);

  const auth: ProviderAuth = {
    provider: args.provider as TaskProvider,
    accessToken: args.accessToken,
    refreshToken: args.refreshToken,
  };

  const lists = await provider.getTaskLists(auth);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ lists }, null, 2),
    }],
  };
}
