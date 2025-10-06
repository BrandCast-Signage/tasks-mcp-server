/**
 * Unified Task interface that works across all providers
 */
export interface Task {
  // Universal identifiers
  id: string;                    // Provider-specific task ID
  provider: TaskProvider;        // Which service this task belongs to
  listId: string;                // Parent list/project ID
  listName: string;              // Human-readable list name

  // Core task properties
  title: string;                 // Task title/summary (required)
  description?: string;          // Detailed notes/description
  status: TaskStatus;            // Current status

  // Temporal properties
  due?: Date;                    // Due date/time
  createdAt: Date;               // When task was created
  updatedAt: Date;               // Last modification time
  completedAt?: Date;            // When task was completed

  // Organization
  priority?: TaskPriority;       // Importance level
  tags?: string[];               // Labels/categories

  // Provider integration
  providerUrl?: string;          // Deep link to task in provider UI
  providerMetadata?: Record<string, unknown>; // Provider-specific fields
}

/**
 * Supported task management providers
 */
export enum TaskProvider {
  GOOGLE = 'google',
  COZI = 'cozi',
  TODOIST = 'todoist',
  MICROSOFT_TODO = 'microsoft-todo',
  APPLE_REMINDERS = 'apple-reminders',
}

/**
 * Task completion status
 */
export enum TaskStatus {
  PENDING = 'pending',           // Not yet completed
  COMPLETED = 'completed',       // Marked as done
  CANCELLED = 'cancelled',       // Cancelled/deleted (soft delete)
}

/**
 * Priority levels (normalized across providers)
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Task list/project container
 */
export interface TaskList {
  id: string;
  provider: TaskProvider;
  name: string;
  description?: string;
  color?: string;              // UI hint (if provider supports)
  taskCount?: number;          // Number of tasks in list
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Configuration for task queries
 */
export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  dueAfter?: Date;
  dueBefore?: Date;
  tags?: string[];
  search?: string;             // Text search in title/description
  limit?: number;              // Max results
  offset?: number;             // Pagination offset
}

/**
 * Provider authentication credentials
 */
export interface ProviderAuth {
  provider: TaskProvider;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  userId?: string;             // User ID in provider's system
}
