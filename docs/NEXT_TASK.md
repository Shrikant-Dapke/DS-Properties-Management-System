# DS Properties — Next Task

**Last Updated:** 2026-06-19  
**Source of Truth:** This file defines exactly what should be done next. Update after each task completion.

---

## Current Task

### Task 02: Initialize Backend Project

**Phase:** 0 — Project Setup & Scaffolding  
**Complexity:** Low  
**Reference:** [AI_EXECUTION_PACK.md → Task 02](file:///C:/Users/dapke/Desktop/DS%20Project/DS-Properties-Management-System/docs/AI_EXECUTION_PACK.md)

---

### Objective

Set up the Node.js/Express backend with all dependencies, ESLint, and environment configuration. After this task, `npm run dev` should start a working server that responds to `/api/v1/health`.

---

### Files to Create

| File | Purpose |
|------|---------|
| `backend/package.json` | Project manifest with scripts and dependencies |
| `backend/.eslintrc.js` | ESLint configuration |
| `backend/.env.example` | Environment variable template |
| `backend/server.js` | Entry point — imports app and starts HTTP server |
| `backend/src/app.js` | Express setup with helmet, cors, body-parser, request logging |
| `backend/src/config/environment.js` | Load and validate env vars from .env |
| `backend/src/config/constants.js` | Role enums, payment modes, transaction types |
| `backend/src/utils/logger.js` | pino logger instance |
| `backend/src/utils/errors.js` | Custom error classes (AppError, NotFoundError, ValidationError) |
| `backend/src/middleware/errorHandler.js` | Global error handler — catches all errors, formats response |
| `backend/src/middleware/requestLogger.js` | Logs HTTP requests with pino |

### Files to Modify

None — all new files.

---

### Dependencies (Completed)

- ✅ Task 01: Project structure initialized

---

### npm Packages to Install

**Production:**
```
express helmet cors dotenv joi bcrypt jsonwebtoken pg pino pino-http express-rate-limit node-cache xss
```

**Development:**
```
eslint jest supertest nodemon pino-pretty
```

---

### Acceptance Criteria

- [ ] `cd backend && npm install` succeeds
- [ ] `npm run dev` starts the server on port 3000 (or PORT env var)
- [ ] `GET /api/v1/health` returns `{ status: "healthy", timestamp: "...", uptime: N, database: "not_connected" }`
- [ ] Environment variables validated on startup — missing required vars cause a clear error
- [ ] Request logging outputs to console (pino-pretty in dev)
- [ ] Unknown routes return 404 with `{ success: false, message: "Route not found" }`
- [ ] Error handler returns `{ success: false, message, errors }` format
- [ ] ESLint runs without errors: `npm run lint`

---

### Definition of Done

- Server starts with `npm run dev`
- `/api/v1/health` returns 200
- Invalid routes return 404 with proper error format
- `npm run lint` passes
- Git commit: "Task 02: Initialize backend project"

---

### After Completion

1. Mark Task 02 as ✅ in `PROJECT_STATUS.md`
2. Update this file (`NEXT_TASK.md`) to **Task 03: Initialize Frontend Project**
3. Add entry to `CHANGELOG.md`

---

## Upcoming Tasks (Preview)

| Order | Task # | Title | Depends On |
|-------|--------|-------|------------|
| **NEXT →** | **02** | **Initialize Backend Project** | ✅ Task 01 |
| 2nd | 03 | Initialize Frontend Project | ✅ Task 01 |
| 3rd | 04 | Design System Foundation Components | Task 03 |
| 4th | 05 | Create Database Migrations | Task 02 |

> [!NOTE]
> Tasks 02 and 03 are independent of each other (both depend only on Task 01). They can be done in either order or in parallel.
