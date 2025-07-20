# Group API Documentation

This document describes the Group API endpoints implemented for the Nova IAM system.

## Base URL
All group endpoints are available under: `/api/realms/{realmName}/groups`

## Authentication
All endpoints require proper authentication with Keycloak admin privileges.

## Endpoints

### 1. List All Groups
**GET** `/api/realms/{realmName}/groups`

Returns all groups in the specified realm.

**Response:**
```json
[
  {
    "id": "group-uuid",
    "name": "Admin Group",
    "path": "/admin-group",
    "parentId": null,
    "subGroups": [],
    "attributes": {}
  }
]
```

### 2. Get Specific Group
**GET** `/api/realms/{realmName}/groups/{groupId}`

Returns details of a specific group.

**Response:**
```json
{
  "id": "group-uuid",
  "name": "Admin Group",
  "path": "/admin-group",
  "parentId": null,
  "subGroups": [],
  "attributes": {}
}
```

### 3. Create Group
**POST** `/api/realms/{realmName}/groups`

Creates a new group in the realm.

**Request Body:**
```json
{
  "name": "New Group",
  "path": "/new-group",
  "parentId": null,
  "attributes": {
    "description": ["A new group for testing"]
  }
}
```

**Response:**
```json
{
  "id": "new-group-uuid",
  "name": "New Group",
  "path": "/new-group",
  "parentId": null,
  "subGroups": [],
  "attributes": {
    "description": ["A new group for testing"]
  }
}
```

### 4. Update Group
**PUT** `/api/realms/{realmName}/groups/{groupId}`

Updates an existing group.

**Request Body:**
```json
{
  "name": "Updated Group Name",
  "path": "/updated-group",
  "attributes": {
    "description": ["Updated description"]
  }
}
```

### 5. Delete Group
**DELETE** `/api/realms/{realmName}/groups/{groupId}`

Deletes a group from the realm.

**Response:** 200 OK (empty body)

### 6. Get Group Members
**GET** `/api/realms/{realmName}/groups/{groupId}/members`

Returns all members of a specific group.

**Response:**
```json
[
  {
    "id": "user-uuid",
    "username": "john.doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "enabled": true
  }
]
```

### 7. Add User to Group
**POST** `/api/realms/{realmName}/groups/{groupId}/members/{userId}`

Adds a user to the specified group.

**Response:** 200 OK (empty body)

### 8. Remove User from Group
**DELETE** `/api/realms/{realmName}/groups/{groupId}/members/{userId}`

Removes a user from the specified group.

**Response:** 200 OK (empty body)

## Error Responses

All endpoints return appropriate HTTP status codes:

- **200 OK** - Success
- **400 Bad Request** - Invalid request data
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

Error responses include details in the response body when applicable.

## Validation

Group names must:
- Be between 1 and 100 characters
- Contain only alphanumeric characters, hyphens, underscores, colons, and forward slashes
- Not contain potentially unsafe characters or injection patterns

Paths are optional and follow similar validation rules.

## Examples

### Creating a group with curl:
```bash
curl -X POST \
  http://localhost:8080/api/realms/test-realm/groups \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <your-token>' \
  -d '{
    "name": "Developers",
    "path": "/developers",
    "attributes": {
      "department": ["Engineering"],
      "level": ["Senior"]
    }
  }'
```

### Adding a user to a group:
```bash
curl -X POST \
  http://localhost:8080/api/realms/test-realm/groups/{groupId}/members/{userId} \
  -H 'Authorization: Bearer <your-token>'
```