import { providerRegistry } from '../providers/index.js';
import { TaskProvider } from '../types/index.js';

/**
 * MCP Tool: listTaskLists
 * Get all task lists/projects from Google Tasks
 */
export const listTaskListsSchema = {
  name: 'listTaskLists',
  description: 'Get all task lists/projects from Google Tasks',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
};

export async function handleListTaskLists() {
  const provider = providerRegistry.get(TaskProvider.GOOGLE);
  const lists = await provider.getTaskLists();

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ lists }, null, 2),
    }],
  };
}
