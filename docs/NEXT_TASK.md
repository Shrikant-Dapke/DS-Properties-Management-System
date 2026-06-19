# DS Properties — Next Task

**Last Updated:** 2026-06-19  
**Source of Truth:** This file defines exactly what should be done next. Update after each task completion.

---

## Current Task

### Task 01: Initialize Project Structure

**Phase:** 0 — Project Setup & Scaffolding  
**Complexity:** Low  
**Reference:** [AI_EXECUTION_PACK.md → Task 01](file:///C:/Users/dapke/Desktop/DS%20Project/DS-Properties-Management-System/docs/AI_EXECUTION_PACK.md)

---

### Objective

Create the project skeleton with git, folder structure, and configuration files. After this task, any developer (human or AI) should be able to clone the repo and understand the project layout.

---

### Files to Create

| File | Purpose |
|------|---------|
| `.gitignore` | Ignore node_modules, .env, dist, logs, OS files |
| `.nvmrc` | Pin Node.js version to 20 |
| `README.md` | Project name, description, setup instructions |
| `docker-compose.yml` | Local PostgreSQL 15 for development |
| `backend/` folder structure | All subdirectories as per `PROJECT_MASTER_PLAN.md` Section 11 |
| `frontend/` | Empty — scaffolded via Vite in Task 03 |

**Backend folder structure to create:**
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
├── migrations/
├── seeds/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── helpers/
└── scripts/
```

### Files to Modify

None — this is a fresh initialization.

---

### Dependencies

None — this is the first task.

---

### Acceptance Criteria

- [ ] Git repository initialized (or existing `.git/` preserved)
- [ ] `.gitignore` covers: `node_modules/`, `.env`, `dist/`, `*.log`, `.DS_Store`, `.idea/`, `.vscode/` (local settings)
- [ ] `.nvmrc` contains `20`
- [ ] `docker-compose.yml` defines a PostgreSQL 15 service with:
  - Volume for data persistence
  - Port 5432 exposed
  - Default dev credentials (username: `dsp_dev`, password: `dsp_dev_password`, database: `dsp_development`)
- [ ] `README.md` contains: project name ("DS Properties Financial Tracking System"), description, prerequisites, setup instructions placeholder
- [ ] Backend folder structure matches `PROJECT_MASTER_PLAN.md` Section 11
- [ ] Each empty directory contains a `.gitkeep` file (so git tracks empty dirs)

---

### Definition of Done

- `git status` shows clean repo with all files tracked
- `docker compose up -d` starts PostgreSQL (if Docker is available)
- Folder structure verified against plan
- README is readable and accurate

---

### After Completion

1. Mark Task 01 as ✅ in `PROJECT_STATUS.md`
2. Update this file (`NEXT_TASK.md`) to Task 02: Initialize Backend Project
3. Add entry to `CHANGELOG.md`

---

## Upcoming Tasks (Preview)

| Order | Task # | Title | Depends On |
|-------|--------|-------|------------|
| **NEXT →** | **01** | **Initialize Project Structure** | Nothing |
| 2nd | 02 | Initialize Backend Project | Task 01 |
| 3rd | 03 | Initialize Frontend Project | Task 01 |
| 4th | 04 | Design System Foundation Components | Task 03 |
| 5th | 05 | Create Database Migrations | Task 02 |

> [!NOTE]
> Tasks 02 and 03 are independent of each other (both depend only on Task 01). They can be done in either order or in parallel.
