import { providerRegistry } from '../providers/index.js';

/**
 * MCP Tool: listProviders
 * Get list of available task management providers
 */
export const listProvidersSchema = {
  name: 'listProviders',
  description: 'Get list of available task management providers and their capabilities',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
};

export async function handleListProviders() {
  const providers = providerRegistry.getAllInfo();

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ providers }, null, 2),
    }],
  };
}
