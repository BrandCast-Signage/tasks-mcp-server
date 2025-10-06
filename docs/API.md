# API Documentation

Complete reference for all Google Tasks MCP Server tools.

## Available Tools

1. [listProviders](#listproviders)
2. [listTaskLists](#listtasklists)
3. [getTasks](#gettasks)
4. [createTask](#createtask)
5. [updateTask](#updatetask)
6. [completeTask](#completetask)
7. [deleteTask](#deletetask)
8. [searchTasks](#searchtasks)
9. [syncAllTasks](#syncalltasks)

---

## listProviders

Get list of available task management providers and their capabilities.

### Parameters

None

### Returns

```json
{
  "providers": [
    {
      "id": "google",
      "name": "Google Tasks",
      "capabilities": {
        "priorities": false,
        "tags": false,
        "descriptions": true,
        "dueDates": true,
        "subtasks": false,
        "search": false
      }
    }
  ]
}
```

### Example Usage

**Claude Prompt:**
> "What task providers are available?"

---

## listTaskLists

Get all task lists/projects for a specific provider.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Task provider (e.g., "google") |
| accessToken | string | Yes | OAuth access token |
| refreshToken | string | No | OAuth refresh token |

### Returns

```json
{
  "lists": [
    {
      "id": "MTIzNDU2Nzg5MDEyMzQ1Njc4OTA",
      "provider": "google",
      "name": "My Tasks",
      "updatedAt": "2025-10-06T12:00:00Z"
    }
  ]
}
```

### Example Usage

**Claude Prompt:**
> "Get my Google Tasks lists using token ya29.a0Aa..."

---

## getTasks

Retrieve tasks from a specific list with optional filtering.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Task provider |
| listId | string | Yes | ID of the task list |
| accessToken | string | Yes | OAuth access token |
| refreshToken | string | No | OAuth refresh token |
| filters | object | No | Optional filters |
| filters.status | string | No | Filter by status (pending/completed) |
| filters.search | string | No | Text search |
| filters.limit | number | No | Max results |

### Returns

```json
{
  "tasks": [
    {
      "id": "abc123",
      "provider": "google",
      "listId": "MTIzNDU2...",
      "listName": "My Tasks",
      "title": "Finish report",
      "description": "Q4 projections",
      "status": "pending",
      "due": "2025-10-10T17:00:00Z",
      "createdAt": "2025-10-01T09:00:00Z",
      "updatedAt": "2025-10-06T14:30:00Z"
    }
  ],
  "total": 1
}
```

### Example Usage

**Claude Prompt:**
> "Show me pending tasks from list MTIzNDU2... using token ya29.a0Aa..."

---

## createTask

Create a new task in a specific list.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Task provider |
| listId | string | Yes | ID of the task list |
| accessToken | string | Yes | OAuth access token |
| refreshToken | string | No | OAuth refresh token |
| task | object | Yes | Task data |
| task.title | string | Yes | Task title |
| task.description | string | No | Task description |
| task.due | string | No | Due date (ISO 8601) |

### Returns

```json
{
  "task": {
    "id": "new-task-123",
    "provider": "google",
    "listId": "MTIzNDU2...",
    "listName": "Shopping",
    "title": "Buy milk",
    "status": "pending",
    "createdAt": "2025-10-06T15:00:00Z",
    "updatedAt": "2025-10-06T15:00:00Z"
  }
}
```

### Example Usage

**Claude Prompt:**
> "Create a task 'Buy milk' in my Shopping list (ID: MTIzNDU2...) due tomorrow using token ya29.a0Aa..."

---

## updateTask

Update an existing task.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Task provider |
| taskId | string | Yes | ID of the task |
| listId | string | Yes | ID of the task list |
| accessToken | string | Yes | OAuth access token |
| refreshToken | string | No | OAuth refresh token |
| updates | object | Yes | Fields to update |
| updates.title | string | No | New title |
| updates.description | string | No | New description |
| updates.due | string | No | New due date |
| updates.status | string | No | New status |

### Returns

```json
{
  "task": {
    "id": "abc123",
    "title": "Updated title",
    ...
  }
}
```

### Example Usage

**Claude Prompt:**
> "Update task abc123 in list MTIzNDU2... - change title to 'Updated title' using token ya29.a0Aa..."

---

## completeTask

Mark a task as completed (convenience method).

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Task provider |
| taskId | string | Yes | ID of the task |
| listId | string | Yes | ID of the task list |
| accessToken | string | Yes | OAuth access token |
| refreshToken | string | No | OAuth refresh token |

### Returns

```json
{
  "task": {
    "id": "abc123",
    "status": "completed",
    "completedAt": "2025-10-06T15:30:00Z",
    ...
  }
}
```

### Example Usage

**Claude Prompt:**
> "Mark task abc123 as completed using token ya29.a0Aa..."

---

## deleteTask

Delete a task permanently.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Task provider |
| taskId | string | Yes | ID of the task |
| listId | string | Yes | ID of the task list |
| accessToken | string | Yes | OAuth access token |
| refreshToken | string | No | OAuth refresh token |

### Returns

```json
{
  "success": true,
  "deletedId": "abc123"
}
```

### Example Usage

**Claude Prompt:**
> "Delete task abc123 from list MTIzNDU2... using token ya29.a0Aa..."

---

## searchTasks

Search tasks across all lists.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| provider | string | Yes | Task provider |
| query | string | Yes | Search text |
| accessToken | string | Yes | OAuth access token |
| refreshToken | string | No | OAuth refresh token |
| filters | object | No | Optional filters |
| filters.status | string | No | Filter by status |
| filters.limit | number | No | Max results |

### Returns

```json
{
  "tasks": [...],
  "total": 5
}
```

### Example Usage

**Claude Prompt:**
> "Search for tasks containing 'report' using token ya29.a0Aa..."

---

## syncAllTasks

Fetch tasks from multiple providers and merge.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| providers | array | Yes | Array of provider configs |
| providers[].provider | string | Yes | Provider name |
| providers[].accessToken | string | Yes | OAuth token |
| providers[].refreshToken | string | No | Refresh token |
| providers[].listIds | array | No | Specific lists to sync |
| filters | object | No | Global filters |
| filters.status | string | No | Filter by status |
| filters.limit | number | No | Max total results |

### Returns

```json
{
  "tasks": [...],
  "total": 25,
  "byProvider": {
    "google": 25
  }
}
```

### Example Usage

**Claude Prompt:**
> "Show me all my pending tasks from Google Tasks using token ya29.a0Aa..."

---

## Error Handling

All tools return errors in this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common error types:
- Authentication errors (invalid/expired tokens)
- Permission errors (missing scopes)
- Not found errors (invalid IDs)
- Rate limit errors (too many requests)

---

## Rate Limits

Google Tasks API rate limits:
- **Queries per day:** 50,000
- **Queries per 100 seconds:** 600

The MCP server does not implement rate limiting, so clients should handle this appropriately.
