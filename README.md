# CRUD API

A simple Node.js CRUD API for managing users, supporting both single-process and cluster (multi-process) modes with consistent state across workers.

## Requirements

- Node.js >= 22.14.0

## Installation

```bash
npm install
```

## Scripts

- `npm run start:dev` — Start in development mode (with hot reload, TypeScript, and nodemon)
- `npm run start:prod` — Build and start in production mode (Webpack bundle)
- `npm run start:multi` — Start in cluster mode (multi-process, shared users state)
- `npm run build` — Build the project using Webpack
- `npm run test` — Run tests (Jest)

## Environment Variables

- `PORT` — Port to run the server (default: 4000)
- `MODE_CLUSTER` — Set to `CLUSTER` to enable cluster mode (default: SINGLE)

## API Endpoints

All endpoints are under `/api/users`.

### Get all users

```
GET /api/users
```

**Response:** `200 OK` — Array of users

### Get user by ID

```
GET /api/users/:id
```

**Response:** `200 OK` — User object

### Create user

```
POST /api/users
Content-Type: application/json
{
  "username": "string",
  "age": number,
  "hobbies": ["string", ...]
}
```

**Response:** `201 Created` — Created user object

### Update user

```
PUT /api/users/:id
Content-Type: application/json
{
  "username": "string",
  "age": number,
  "hobbies": ["string", ...]
}
```

**Response:** `200 OK` — Updated user object

### Delete user

```
DELETE /api/users/:id
```

**Response:** `204 No Content`

## User Object

```json
{
  "id": "uuid",
  "username": "string",
  "age": number,
  "hobbies": ["string", ...]
}
```

## Validation

- `username`: required, string
- `age`: required, number
- `hobbies`: required, array of strings
- `id`: must be a valid UUID (for GET/PUT/DELETE by id)

## Testing

Run all tests with:

```bash
npm run test
```

Tests use Jest and Supertest, covering positive and negative cases for all endpoints.

## Cluster Mode

When started with `npm run start:multi` or `MODE_CLUSTER=CLUSTER`, the app runs in cluster mode, sharing the users state between all workers for consistent results across requests.
