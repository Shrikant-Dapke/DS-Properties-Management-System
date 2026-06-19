# DS Properties — Financial Tracking System

A web-based financial tracking application for DS Properties, a land plotting business. Tracks all money received from customers (intake) and money spent on construction activities (outtake), maintaining a real-time cash balance with categorized reporting.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js 20 + Express.js |
| Database | PostgreSQL 15 |
| Auth | JWT + bcrypt |
| Logging | pino |
| Export | jsPDF + ExcelJS (client-side) |

---

## Prerequisites

- **Node.js** 20 LTS ([download](https://nodejs.org/))
- **Docker** & Docker Compose ([download](https://docs.docker.com/get-docker/)) — for local PostgreSQL
- **Git**

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd DS-Properties-Management-System
```

### 2. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 15 on `localhost:5432` with:
- Database: `dsp_development`
- Username: `dsp_dev`
- Password: `dsp_dev_password`

### 3. Set up the backend

```bash
cd backend
cp .env.example .env    # Copy and configure environment variables
npm install
npm run migrate         # Run database migrations
npm run seed            # Seed default data
npm run dev             # Start dev server on port 3000
```

### 4. Set up the frontend

```bash
cd frontend
cp .env.example .env    # Copy and configure environment variables
npm install
npm run dev             # Start dev server on port 5173
```

### 5. Open the application

Navigate to `http://localhost:5173` in your browser.

Default admin login:
- Username: `admin`
- Password: `admin123` (change immediately)

---

## Project Structure

```
DS-Properties-Management-System/
├── docs/               # Architecture, planning, and tracking documents
├── backend/            # Node.js + Express REST API
│   ├── src/
│   │   ├── config/     # Database, environment, constants
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/ # Auth, validation, error handling, audit
│   │   ├── models/     # Database query functions
│   │   ├── routes/     # Express route definitions
│   │   ├── services/   # Business logic
│   │   ├── utils/      # Helpers, formatters, logger
│   │   └── validators/ # Joi validation schemas
│   ├── migrations/     # SQL migration files
│   ├── seeds/          # Seed data scripts
│   ├── tests/          # Unit and integration tests
│   └── scripts/        # Migration runner, seed runner
├── frontend/           # React SPA
│   └── src/
│       ├── api/        # Axios API client modules
│       ├── components/ # Reusable UI components
│       ├── contexts/   # React contexts (auth, toast)
│       ├── hooks/      # Custom React hooks
│       ├── pages/      # Page components
│       ├── styles/     # CSS / Tailwind base styles
│       └── utils/      # Formatters, constants, helpers
├── scripts/            # Deployment and backup scripts
├── docker-compose.yml  # Local PostgreSQL
└── README.md           # This file
```

---

## Documentation

All planning and architecture documents are in the `docs/` directory:

| Document | Purpose |
|----------|---------|
| `PROJECT_STATUS.md` | Current project completion status |
| `NEXT_TASK.md` | What to build next |
| `AI_EXECUTION_PACK.md` | 38 sequential implementation tasks |
| `PROJECT_MASTER_PLAN.md` | Revised architecture and requirements |
| `ARCHITECTURE_REVIEW.md` | Critical review of original specs |
| `DATABASE_REVIEW.md` | Production-ready PostgreSQL schema |
| `API_REVIEW.md` | Complete REST API specification (28 endpoints) |
| `SECURITY_CHECKLIST.md` | 80+ security controls |
| `DECISIONS.md` | Architecture Decision Records |
| `DEVELOPMENT_ROADMAP.md` | Phased development plan |
| `CHANGELOG.md` | Chronological change history |

---

## User Roles

| Role | Access |
|------|--------|
| Admin | Full access — CRUD, user management, settings, delete with password |
| Operator | Create transactions, view dashboard and reports |
| Viewer | Read-only access to dashboard and reports |

---

## License

Proprietary — DS Properties. All rights reserved.
