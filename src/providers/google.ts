import { google, type tasks_v1 } from 'googleapis';
import {
  BaseTaskProvider,
  Task,
  TaskList,
  TaskFilters,
  TaskProvider,
  TaskStatus,
  type ProviderCapabilities,
} from '../types/index.js';

/**
 * Google Tasks provider implementation
 * Uses environment variables for authentication:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 * - GOOGLE_REFRESH_TOKEN
 */
export class GoogleTasksProvider extends BaseTaskProvider {
  readonly id = TaskProvider.GOOGLE;
  readonly name = 'Google Tasks';
  readonly capabilities: ProviderCapabilities = {
    priorities: false,      // Google Tasks doesn't support priorities
    tags: false,            // Google Tasks doesn't support tags/labels
    descriptions: true,     // Google Tasks supports notes/descriptions
    dueDates: true,         // Google Tasks supports due dates
    subtasks: false,        // Limited subtask support
    search: false,          // No native search API, must filter client-side
  };

  private oauth2Client: InstanceType<typeof google.auth.OAuth2>;
  private tasksClient?: tasks_v1.Tasks;

  constructor() {
    super();

    // Get credentials from environment
    const clientId = process.env['GOOGLE_CLIENT_ID'];
    const clientSecret = process.env['GOOGLE_CLIENT_SECRET'];
    const refreshToken = process.env['GOOGLE_REFRESH_TOKEN'];

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
    }

    if (!refreshToken) {
      throw new Error('Google refresh token not configured. Run "npm run auth" to get your refresh token, then set GOOGLE_REFRESH_TOKEN environment variable.');
    }

    // Create OAuth2 client with credentials
    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    // The OAuth client will automatically refresh access tokens when needed
  }

  /**
   * Get authenticated Google Tasks client (lazy initialization)
   */
  private getClient(): tasks_v1.Tasks {
    if (!this.tasksClient) {
      this.tasksClient = google.tasks({ version: 'v1', auth: this.oauth2Client });
    }
    return this.tasksClient;
  }

  /**
   * Get all task lists for authenticated user
   */
  async getTaskLists(): Promise<TaskList[]> {
    const client = this.getClient();

    try {
      const response = await client.tasklists.list();

      if (!response.data.items) {
        return [];
      }

      return response.data.items.map(list => this.transformTaskList(list));
    } catch (error) {
      throw new Error(`Failed to fetch Google task lists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get tasks from a specific list
   */
  async getTasks(
    listId: string,
    filters?: TaskFilters
  ): Promise<Task[]> {
    const client = this.getClient();

    try {
      // Get list name
      const listResponse = await client.tasklists.get({ tasklist: listId });
      const listName = listResponse.data.title || 'Unknown List';

      // Build request parameters
      const params: tasks_v1.Params$Resource$Tasks$List = {
        tasklist: listId,
        showCompleted: filters?.status !== TaskStatus.PENDING,
        showDeleted: false,
        showHidden: false,
      };

      // Apply date filters if provided
      if (filters?.dueBefore) {
        params.dueMax = filters.dueBefore.toISOString();
      }
      if (filters?.dueAfter) {
        params.dueMin = filters.dueAfter.toISOString();
      }

      // Limit results (Google Tasks max is 100)
      if (filters?.limit) {
        params.maxResults = Math.min(filters.limit, 100);
      }

      const response = await client.tasks.list(params);

      if (!response.data.items) {
        return [];
      }

      let tasks = response.data.items.map(task =>
        this.transformTask(task, listId, listName)
      );

      // Apply client-side filters (search, tags, etc.)
      if (filters) {
        tasks = this.applyFilters(tasks, filters);
      }

      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch tasks from list ${listId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new task
   */
  async createTask(
    listId: string,
    task: Partial<Task>
  ): Promise<Task> {
    const client = this.getClient();

    try {
      // Build Google Tasks request body
      const googleTask: tasks_v1.Schema$Task = {
        title: task.title || 'New Task',
      };

      if (task.description) {
        googleTask.notes = task.description;
      }
      if (task.due) {
        googleTask.due = task.due.toISOString();
      }

      const response = await client.tasks.insert({
        tasklist: listId,
        requestBody: googleTask,
      });

      // Get list name
      const listResponse = await client.tasklists.get({ tasklist: listId });
      const listName = listResponse.data.title || 'Unknown List';

      return this.transformTask(response.data, listId, listName);
    } catch (error) {
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(
    taskId: string,
    listId: string,
    updates: Partial<Task>
  ): Promise<Task> {
    const client = this.getClient();

    try {
      // Build Google Tasks update object
      const googleUpdates = this.transformUpdates(updates);

      const response = await client.tasks.patch({
        tasklist: listId,
        task: taskId,
        requestBody: googleUpdates,
      });

      // Get list name
      const listResponse = await client.tasklists.get({ tasklist: listId });
      const listName = listResponse.data.title || 'Unknown List';

      return this.transformTask(response.data, listId, listName);
    } catch (error) {
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(
    taskId: string,
    listId: string
  ): Promise<void> {
    const client = this.getClient();

    try {
      await client.tasks.delete({
        tasklist: listId,
        task: taskId,
      });
    } catch (error) {
      throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search tasks across all lists
   * Note: Google Tasks API doesn't support search, so we fetch all and filter
   */
  async searchTasks(
    query: string,
    filters?: TaskFilters
  ): Promise<Task[]> {
    // Get all task lists
    const lists = await this.getTaskLists();

    // Fetch tasks from all lists
    const allTasksPromises = lists.map(list =>
      this.getTasks(list.id, filters).catch(() => [])
    );

    const allTasksArrays = await Promise.all(allTasksPromises);
    const allTasks = allTasksArrays.flat();

    // Apply search filter
    const searchLower = query.toLowerCase();
    return allTasks.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  }

  /**
   * Validate authentication credentials
   */
  async validateAuth(): Promise<boolean> {
    try {
      const client = this.getClient();
      await client.tasklists.list({ maxResults: 1 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Transform Google Tasks task to unified Task interface
   */
  private transformTask(
    googleTask: tasks_v1.Schema$Task,
    listId: string,
    listName: string
  ): Task {
    return {
      id: googleTask.id!,
      provider: this.id,
      listId,
      listName,
      title: googleTask.title || 'Untitled Task',
      description: googleTask.notes || undefined,
      status: googleTask.status === 'completed' ? TaskStatus.COMPLETED : TaskStatus.PENDING,
      due: googleTask.due ? new Date(googleTask.due) : undefined,
      createdAt: new Date(googleTask.updated!),
      updatedAt: new Date(googleTask.updated!),
      completedAt: googleTask.completed ? new Date(googleTask.completed) : undefined,
      providerUrl: googleTask.selfLink || undefined,
      providerMetadata: {
        position: googleTask.position,
        etag: googleTask.etag,
        parent: googleTask.parent,
        hidden: googleTask.hidden,
        deleted: googleTask.deleted,
      },
    };
  }

  /**
   * Transform Google Tasks list to unified TaskList interface
   */
  private transformTaskList(googleTaskList: tasks_v1.Schema$TaskList): TaskList {
    return {
      id: googleTaskList.id!,
      provider: this.id,
      name: googleTaskList.title || 'Untitled List',
      updatedAt: googleTaskList.updated ? new Date(googleTaskList.updated) : undefined,
    };
  }

  /**
   * Transform unified task updates to Google Tasks format
   */
  private transformUpdates(updates: Partial<Task>): Partial<tasks_v1.Schema$Task> {
    const googleUpdates: Partial<tasks_v1.Schema$Task> = {};

    if (updates.title !== undefined) {
      googleUpdates.title = updates.title;
    }
    if (updates.description !== undefined) {
      googleUpdates.notes = updates.description;
    }
    if (updates.due !== undefined) {
      googleUpdates.due = updates.due ? updates.due.toISOString() : null;
    }
    if (updates.status === TaskStatus.COMPLETED) {
      googleUpdates.status = 'completed';
      googleUpdates.completed = new Date().toISOString();
    } else if (updates.status === TaskStatus.PENDING) {
      googleUpdates.status = 'needsAction';
      googleUpdates.completed = null;
    }

    return googleUpdates;
  }
}
