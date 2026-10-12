# Task Manager Backend

Fastify + Sequelize (SQLite) + JWT auth backend.

## What you need installed on your computer

1. **Node.js** (v18 or higher) — download from https://nodejs.org
   Check it's installed: `node -v`
2. A code editor — **VS Code** (https://code.visualstudio.com) is recommended
3. **Postman** or **Thunder Client** (VS Code extension) — to test the API endpoints, since there's no frontend yet

## Setup steps

1. Open this folder in VS Code (or unzip it and open in your terminal)
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the environment file and fill in a real secret:
   ```
   cp .env.example .env
   ```
   Then open `.env` and change `JWT_SECRET` to any long random string.
4. Start the server in dev mode (auto-restarts on file changes):
   ```
   npm run dev
   ```
5. You should see:
   ```
   ✅ Database connection established.
   Server listening at http://0.0.0.0:3001
   ```
   A `database.sqlite` file will appear in the project root — that's your database.

## Testing the API

### 1. Sign up
```
POST http://localhost:3001/auth/signup
Content-Type: application/json

{ "email": "test@example.com", "password": "password123" }
```

### 2. Log in (get a token)
```
POST http://localhost:3001/auth/login
Content-Type: application/json

{ "email": "test@example.com", "password": "password123" }
```
Response: `{ "token": "eyJhbGciOi..." }` — copy this token.

### 3. Create a task (protected route)
```
POST http://localhost:3001/tasks
Authorization: Bearer <paste token here>
Content-Type: application/json

{ "title": "Finish tutor assignment", "status": "TODO" }
```

### 4. Get your tasks
```
GET http://localhost:3001/tasks
Authorization: Bearer <paste token here>
```

## Project structure

```
src/
  models/     Sequelize models (User, Task)
  routes/     API route handlers (auth, tasks)
  plugins/    Fastify plugins (JWT auth)
  utils/      Helpers (db connection, password hashing)
  server.js   App entry point
```

## Next steps (not built yet)
- Next.js frontend to consume this API
- Role-based route restrictions (ADMIN-only endpoints)
- Refresh tokens
