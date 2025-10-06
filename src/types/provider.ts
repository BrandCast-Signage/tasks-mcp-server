import type { Task, TaskList, TaskFilters, ProviderAuth, TaskProvider } from './task.js';

/**
 * Provider capabilities metadata
 */
export interface ProviderCapabilities {
  priorities: boolean;
  tags: boolean;
  descriptions: boolean;
  dueDates: boolean;
  subtasks: boolean;
  search: boolean;
}

/**
 * Base class for all task provider adapters
 */
export abstract class BaseTaskProvider {
  abstract readonly id: TaskProvider;
  abstract readonly name: string;
  abstract readonly capabilities: ProviderCapabilities;

  /**
   * Get all task lists for authenticated user
   */
  abstract getTaskLists(auth: ProviderAuth): Promise<TaskList[]>;

  /**
   * Get tasks from a specific list
   */
  abstract getTasks(
    auth: ProviderAuth,
    listId: string,
    filters?: TaskFilters
  ): Promise<Task[]>;

  /**
   * Create a new task
   */
  abstract createTask(
    auth: ProviderAuth,
    listId: string,
    task: Partial<Task>
  ): Promise<Task>;

  /**
   * Update an existing task
   */
  abstract updateTask(
    auth: ProviderAuth,
    taskId: string,
    listId: string,
    updates: Partial<Task>
  ): Promise<Task>;

  /**
   * Delete a task
   */
  abstract deleteTask(
    auth: ProviderAuth,
    taskId: string,
    listId: string
  ): Promise<void>;

  /**
   * Search tasks across all lists
   */
  abstract searchTasks(
    auth: ProviderAuth,
    query: string,
    filters?: TaskFilters
  ): Promise<Task[]>;

  /**
   * Validate authentication credentials
   */
  abstract validateAuth(auth: ProviderAuth): Promise<boolean>;

  /**
   * Apply filters to a list of tasks (client-side filtering)
   */
  protected applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
    let filtered = tasks;

    // Filter by status
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filtered = filtered.filter(task => statuses.includes(task.status));
    }

    // Filter by priority
    if (filters.priority) {
      const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
      filtered = filtered.filter(task => task.priority && priorities.includes(task.priority));
    }

    // Filter by due date range
    if (filters.dueAfter) {
      filtered = filtered.filter(task => task.due && task.due >= filters.dueAfter!);
    }
    if (filters.dueBefore) {
      filtered = filtered.filter(task => task.due && task.due <= filters.dueBefore!);
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags && filters.tags!.some(tag => task.tags!.includes(tag))
      );
    }

    // Text search in title and description
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply limit and offset for pagination
    if (filters.offset !== undefined && filters.offset > 0) {
      filtered = filtered.slice(filters.offset);
    }
    if (filters.limit !== undefined && filters.limit > 0) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }
}

/**
 * Provider information for listProviders tool
 */
export interface ProviderInfo {
  id: TaskProvider;
  name: string;
  capabilities: ProviderCapabilities;
}
