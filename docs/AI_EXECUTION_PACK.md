# DS Properties — AI Developer Execution Pack

**Purpose:** This document breaks the entire project into small, sequentially executable tasks for an AI coding assistant. Each task is self-contained with clear inputs, outputs, and acceptance criteria.

**Total Tasks:** 38  
**Estimated Total Duration:** 8-10 weeks

> [!IMPORTANT]
> Execute tasks in order. Each task depends on previous tasks being complete. Do not skip tasks. Reference `DATABASE_REVIEW.md`, `API_REVIEW.md`, and `PROJECT_MASTER_PLAN.md` for detailed specifications.

---

## Phase 0: Project Setup & Scaffolding

---

### Task 01: Initialize Project Structure

**Objective:** Create the project skeleton with git, folder structure, and configuration files.

**Files to Create:**
- `.gitignore`
- `.nvmrc`
- `README.md`
- `docker-compose.yml`
- `backend/` (empty folder structure as per PROJECT_MASTER_PLAN.md Section 11)
- `frontend/` (empty — will be scaffolded in Task 03)

**Files to Modify:** None

**Dependencies:** None

**Acceptance Criteria:**
- Git repository initialized
- `.gitignore` covers `node_modules/`, `.env`, `dist/`, `*.log`, `.DS_Store`
- `.nvmrc` specifies Node.js 20
- `docker-compose.yml` defines PostgreSQL 15 service with volume, port 5432, default credentials for dev
- `README.md` has project name, description, setup instructions placeholder
- Backend folder structure matches `PROJECT_MASTER_PLAN.md` Section 11

**Definition of Done:**
- `git status` shows clean repo with initial commit
- `docker compose up -d` starts PostgreSQL successfully
- Folder structure verified

---

### Task 02: Initialize Backend Project

**Objective:** Set up the Node.js/Express backend with all dependencies, ESLint, and environment configuration.

**Files to Create:**
- `backend/package.json`
- `backend/.eslintrc.js`
- `backend/.env.example`
- `backend/server.js` (entry point — minimal, just imports app and listens)
- `backend/src/app.js` (Express setup with helmet, cors, body-parser, morgan)
- `backend/src/config/environment.js` (load and validate env vars)
- `backend/src/config/constants.js` (role enums, payment modes, transaction types)
- `backend/src/utils/logger.js` (pino logger instance)
- `backend/src/utils/errors.js` (custom AppError, NotFoundError, ValidationError classes)
- `backend/src/middleware/errorHandler.js` (global error handler — catches all, formats response)
- `backend/src/middleware/requestLogger.js` (logs HTTP requests with pino)

**Files to Modify:** None

**Dependencies:** Task 01

**npm packages to install:**
```
express helmet cors dotenv joi bcrypt jsonwebtoken pg pino pino-pretty express-rate-limit node-cache xss
```
Dev dependencies:
```
eslint jest supertest nodemon
```

**Acceptance Criteria:**
- `npm run dev` starts the server on port 3000
- Server responds to GET /api/v1/health with `{ status: 'healthy' }`
- Environment variables validated on startup (errors for missing required vars)
- Request logging outputs to console
- Error handler returns `{ success: false, message, errors }` format
- ESLint runs without errors

**Definition of Done:**
- Server starts with `npm run dev`
- `/api/v1/health` returns 200
- Invalid routes return 404 with proper error format

---

### Task 03: Initialize Frontend Project

**Objective:** Scaffold the React frontend with Vite, configure Tailwind CSS with the design system tokens, and establish the base CSS.

**Files to Create:**
- `frontend/` — scaffolded via `npm create vite@latest`
- `frontend/tailwind.config.js` (custom theme with colors from UI/UX Design Brief)
- `frontend/src/styles/index.css` (Tailwind directives + custom base styles)
- `frontend/.env.example` (VITE_API_URL)

**Files to Modify:**
- `frontend/vite.config.js` (add proxy for /api to backend during development)
- `frontend/src/main.jsx` (import styles/index.css)
- `frontend/index.html` (add Inter font from Google Fonts, update title to "DS Properties")

**Dependencies:** Task 01

**Tailwind Theme Configuration** (from UI/UX Design Brief):
```javascript
colors: {
  primary:    { DEFAULT: '#1E3A8A', light: '#3B82F6' },
  success:    { DEFAULT: '#16A34A' },
  danger:     { DEFAULT: '#DC2626' },
  warning:    { DEFAULT: '#D97706' },
  surface:    { DEFAULT: '#FFFFFF' },
  background: { DEFAULT: '#F8FAFC' },
  border:     { DEFAULT: '#E2E8F0' },
  text:       { primary: '#0F172A', muted: '#64748B' },
}
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

**Acceptance Criteria:**
- `npm run dev` starts Vite dev server
- Tailwind classes use custom color tokens (e.g., `text-primary`, `bg-success`)
- Inter font loads from Google Fonts
- Page title is "DS Properties — Financial Tracking"
- API proxy forwards `/api` requests to `http://localhost:3000`

**Definition of Done:**
- Frontend runs on port 5173
- A test `<h1>` with `className="text-primary font-bold text-2xl"` renders in DS Properties blue with Inter font

---

### Task 04: Create Design System Foundation Components

**Objective:** Build the reusable base component library that all pages will use.

**Files to Create:**
- `frontend/src/components/common/Button.jsx`
- `frontend/src/components/common/Input.jsx`
- `frontend/src/components/common/Select.jsx`
- `frontend/src/components/common/Card.jsx`
- `frontend/src/components/common/Badge.jsx`
- `frontend/src/components/common/LoadingSpinner.jsx`
- `frontend/src/components/common/SkeletonLoader.jsx`
- `frontend/src/components/common/EmptyState.jsx`
- `frontend/src/components/common/Modal.jsx`
- `frontend/src/components/common/ConfirmDialog.jsx`
- `frontend/src/components/common/Toast.jsx`
- `frontend/src/contexts/ToastContext.jsx`
- `frontend/src/utils/formatters.js` (formatCurrency, formatDate, formatINR)
- `frontend/src/utils/constants.js` (routes, payment modes, transaction types)

**Files to Modify:**
- `frontend/src/App.jsx` (wrap with ToastProvider)

**Dependencies:** Task 03

**Component Specifications:**
- **Button:** Variants — primary (blue), success (green), danger (red), outline, ghost. Sizes — sm, md, lg. Loading state with spinner. Disabled state.
- **Input:** Floating label, error state (red border + message), disabled state. Supports type=text, number, date.
- **Select:** Dropdown with floating label. Accepts options array `[{ value, label }]`.
- **Card:** White surface, subtle shadow, rounded corners. Optional header and footer.
- **Badge:** Pill shape. Variants match colors — intake (green), outtake (red), neutral (gray).
- **Modal:** Overlay background, centered content, close button, prevents scroll. Sizes — sm, md, lg.
- **ConfirmDialog:** Modal with warning icon, message, cancel + confirm buttons. Confirm button can be danger.
- **Toast:** Fixed position top-right. Types: success (green), error (red), warning (amber), info (blue). Auto-dismiss after 5 seconds.
- **LoadingSpinner:** Spinning circle animation. Sizes — sm, md, lg.
- **SkeletonLoader:** Shimmer animation. Shapes — text (line), card (rectangle), circle.
- **EmptyState:** Centered illustration placeholder, title, description, optional action button.

**formatCurrency spec:**
- Input: `1500000.50` → Output: `₹15,00,000.50` (Indian number formatting with ₹ prefix)
- Use `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`

**Acceptance Criteria:**
- All components render without errors
- Components accept className prop for extension
- Toast system works (useToast hook triggers toasts from any component)
- formatCurrency correctly formats Indian rupees with commas

**Definition of Done:**
- Components can be imported and rendered in App.jsx for visual verification
- No console errors or warnings

---

## Phase 1: Database & Authentication

---

### Task 05: Create Database Migrations

**Objective:** Create all SQL migration files for the production-ready schema (as defined in `DATABASE_REVIEW.md`).

**Files to Create:**
- `backend/migrations/001_create_users.sql`
- `backend/migrations/002_create_customers.sql`
- `backend/migrations/003_create_expense_categories.sql`
- `backend/migrations/004_create_transactions.sql`
- `backend/migrations/005_create_audit_logs.sql`
- `backend/migrations/006_create_refresh_tokens.sql`
- `backend/migrations/007_create_app_settings.sql`
- `backend/migrations/008_create_triggers.sql`
- `backend/scripts/migrate.js` (reads and executes migration files in order)

**Files to Modify:** None

**Dependencies:** Task 02

**Acceptance Criteria:**
- All 7 tables created with exact column types, constraints, and indexes from `DATABASE_REVIEW.md`
- CHECK constraints enforced on `type`, `payment_mode`, `role`, `action`
- Foreign keys with ON DELETE RESTRICT (except refresh_tokens → CASCADE)
- Partial indexes with `WHERE deleted_at IS NULL`
- Composite indexes for common queries
- `updated_at` trigger on all relevant tables
- `node backend/scripts/migrate.js` runs all migrations successfully
- Idempotent: running twice does not error (use IF NOT EXISTS)

**Definition of Done:**
- `\dt` in psql shows 7 tables
- `\di` shows all expected indexes
- Constraints verified with test inserts

---

### Task 06: Create Seed Data Scripts

**Objective:** Seed the database with default categories, admin user, and app settings.

**Files to Create:**
- `backend/seeds/001_seed_categories.js`
- `backend/seeds/002_seed_admin_user.js`
- `backend/seeds/003_seed_app_settings.js`
- `backend/scripts/seed.js` (runs all seed files in order)

**Files to Modify:** None

**Dependencies:** Task 05

**Acceptance Criteria:**
- 7 expense categories seeded (as per DATABASE_REVIEW.md seed data)
- Admin user created with bcrypt-hashed password (default: `admin123` — must be changed on production)
- App settings: opening_balance=0, company_name=DS Properties, currency_symbol=₹, financial_year_start_month=4
- Seed script is idempotent (check before insert, don't duplicate)

**Definition of Done:**
- `SELECT * FROM expense_categories` returns 7 rows with correct colors and slugs
- `SELECT * FROM users` returns 1 admin user with hashed password
- `SELECT * FROM app_settings` returns 4 settings rows

---

### Task 07: Database Connection & Configuration

**Objective:** Set up the PostgreSQL connection pool with proper configuration.

**Files to Create:**
- `backend/src/config/database.js`

**Files to Modify:**
- `backend/src/config/environment.js` (add DATABASE_URL validation)

**Dependencies:** Task 05

**Acceptance Criteria:**
- Connection pool configured with: min 5, max 20 connections
- Pool uses `DATABASE_URL` from environment
- SSL configured for production (optional for development)
- Connection tested on startup with a simple query
- Graceful shutdown: pool closes on SIGTERM/SIGINT
- Error handling: clear error message if DB is unreachable

**Definition of Done:**
- Server starts and logs "Database connected" on success
- Server exits gracefully with "Database connection failed" on bad credentials

---

### Task 08: Build User & Auth Models

**Objective:** Create database query functions for users and refresh tokens.

**Files to Create:**
- `backend/src/models/userModel.js`
- `backend/src/models/refreshTokenModel.js`

**Files to Modify:** None

**Dependencies:** Task 07

**User Model Functions:**
- `findByUsername(username)` — returns user by username (active, non-deleted)
- `findByPublicId(publicId)` — returns user by UUID
- `findAll()` — returns all active users (admin use)
- `create({ name, username, passwordHash, role })` — insert new user
- `update(publicId, { name, role, isActive })` — update user fields
- `updatePassword(publicId, passwordHash)` — update password
- `incrementFailedAttempts(id)` — increment counter, set locked_until if ≥ 5
- `resetFailedAttempts(id)` — reset counter and locked_until
- `updateLastLogin(id)` — update last_login_at

**Refresh Token Model Functions:**
- `create(userId, tokenHash, expiresAt)` — insert token
- `findByTokenHash(tokenHash)` — find active (non-revoked, non-expired) token
- `revoke(tokenHash)` — set revoked_at
- `revokeAllForUser(userId)` — revoke all tokens for a user
- `deleteExpired()` — cleanup expired tokens

**Acceptance Criteria:**
- All functions use parameterized queries (no string concatenation)
- All functions return plain objects (not pg Result objects)
- Error handling wraps pg errors in custom AppError

**Definition of Done:**
- Unit tests for each function pass
- SQL injection not possible via any parameter

---

### Task 09: Build Auth Service

**Objective:** Implement authentication business logic — login, token generation, token refresh, password change.

**Files to Create:**
- `backend/src/services/authService.js`

**Files to Modify:** None

**Dependencies:** Task 08

**Functions:**
- `login(username, password)` → returns `{ user, accessToken, refreshToken }`
  - Validates credentials against bcrypt hash
  - Checks account lockout (is locked_until > now?)
  - Increments failed attempts on failure
  - Resets failed attempts on success
  - Generates JWT access token (8hr, payload: userId, role)
  - Generates refresh token (30d, stored hashed in DB)
  - Logs event to audit_logs
- `refreshAccessToken(refreshToken)` → returns `{ accessToken }`
  - Validates refresh token exists, not expired, not revoked
  - Generates new access token
- `logout(refreshToken)` → revokes token
- `changePassword(userId, currentPassword, newPassword)` → updates password, revokes all sessions

**Acceptance Criteria:**
- Login returns tokens on valid credentials
- Login throws `AuthenticationError` on invalid credentials
- Login throws `AccountLockedError` when account is locked
- Account locks for 15 minutes after 5 consecutive failures
- Refresh returns new access token for valid refresh token
- Refresh throws error for expired/revoked tokens
- Change password revokes all existing sessions
- All auth events logged to audit_logs

**Definition of Done:**
- Unit tests cover all paths: success, wrong password, locked account, expired token, revoked token

---

### Task 10: Build Auth Controller, Routes & Validators

**Objective:** Create the Express route handlers for authentication endpoints.

**Files to Create:**
- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`
- `backend/src/validators/authValidators.js`

**Files to Modify:**
- `backend/src/routes/index.js` (register auth routes)
- `backend/src/app.js` (mount routes)

**Dependencies:** Task 09

**Endpoints:**
- `POST /api/v1/auth/login` — public
- `POST /api/v1/auth/refresh` — public
- `POST /api/v1/auth/logout` — authenticated
- `PUT /api/v1/auth/change-password` — authenticated

**Validators (Joi):**
- loginValidator: `{ username: string().min(3).max(50).required(), password: string().min(8).max(128).required() }`
- refreshValidator: `{ refreshToken: string().required() }`
- changePasswordValidator: `{ currentPassword: string().required(), newPassword: string().min(8).max(128).required() }`

**Acceptance Criteria:**
- All endpoints respond with correct status codes
- Validation errors return 400 with field-level error messages
- Login rate limited to 10 req/min per IP
- Successful login returns user object (no password_hash), accessToken, refreshToken
- All response bodies follow `{ success, data/message, errors }` format

**Definition of Done:**
- Integration tests: login success, login failure, refresh, logout, change password
- Rate limiting verified (11th request returns 429)

---

### Task 11: Build JWT Authentication & Authorization Middleware

**Objective:** Create middleware that verifies JWT tokens and enforces role-based access.

**Files to Create:**
- `backend/src/middleware/authenticate.js`
- `backend/src/middleware/authorize.js`
- `backend/src/middleware/rateLimiter.js`

**Files to Modify:** None

**Dependencies:** Task 09

**authenticate.js:**
- Extracts Bearer token from Authorization header
- Verifies JWT signature and expiry
- Attaches `req.user = { id, publicId, role }` to request
- Returns 401 if token missing, invalid, or expired

**authorize.js:**
- Factory function: `authorize(...allowedRoles)` returns middleware
- Checks `req.user.role` against allowed roles
- Returns 403 if role not allowed
- Usage: `authorize('admin')`, `authorize('admin', 'operator')`

**rateLimiter.js:**
- Export tiered rate limiters:
  - `authLimiter`: 10 req/min per IP
  - `writeLimiter`: 30 req/min per user
  - `readLimiter`: 200 req/min per user
  - `globalLimiter`: 500 req/min per IP

**Acceptance Criteria:**
- Protected routes reject requests without token (401)
- Protected routes reject requests with expired token (401)
- Protected routes reject wrong role (403)
- `req.user` is available in subsequent middleware/controllers
- Rate limiters return 429 with `Retry-After` header

**Definition of Done:**
- Integration tests verify 401, 403, 429 responses

---

### Task 12: Build Audit Logging Middleware

**Objective:** Create middleware that automatically logs create/update/delete operations to audit_logs.

**Files to Create:**
- `backend/src/middleware/auditLogger.js`
- `backend/src/models/auditModel.js`

**Files to Modify:** None

**Dependencies:** Task 07, Task 11

**auditLogger.js:**
- Factory middleware: `auditLog(tableName)` — wraps response to capture action
- After successful mutation (201, 200 on PUT, 200 on DELETE): inserts audit record
- Captures: user_id, action (create/update/delete), table_name, record_id, old_value, new_value, ip_address, user_agent
- IP extracted from `req.ip` or `X-Forwarded-For`
- Does NOT block the response — logs asynchronously

**auditModel.js:**
- `create({ userId, action, tableName, recordId, oldValue, newValue, ipAddress, userAgent })`
- `findAll({ userId, action, tableName, dateFrom, dateTo, page, limit })` — paginated query

**Acceptance Criteria:**
- Every transaction create/update/delete is recorded
- Old and new values stored as JSONB
- Audit logging failures do not crash the request
- IP address correctly captured behind Nginx proxy

**Definition of Done:**
- Create a transaction → audit_logs has a row with action='create'
- Update a transaction → audit_logs has old_value and new_value
- Delete a transaction → audit_logs has action='delete'

---

### Task 13: Build Login Page (Frontend)

**Objective:** Create the login page UI with form validation, error handling, and redirect.

**Files to Create:**
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/api/client.js` (axios instance with base URL, interceptors)
- `frontend/src/api/authApi.js` (login, refresh, logout API calls)
- `frontend/src/contexts/AuthContext.jsx`
- `frontend/src/hooks/useAuth.js`

**Files to Modify:**
- `frontend/src/App.jsx` (add AuthProvider, set up React Router, add login route)
- `frontend/src/main.jsx` (wrap with BrowserRouter)

**Dependencies:** Task 04, Task 10

**Login Page Spec:**
- Centered card on page with DS Properties branding (DSP initials, blue header)
- Username field with floating label
- Password field with floating label + toggle visibility
- "Login" button (primary blue, full width)
- Error message display below form (red text)
- Loading state on button during API call
- On success: store tokens (accessToken in memory, refreshToken in localStorage)
- On success: redirect to /dashboard

**AuthContext Spec:**
- Stores current user object and accessToken in state
- `login(username, password)` — calls API, stores tokens, sets user
- `logout()` — calls API, clears tokens, redirects to /login
- `isAuthenticated` — boolean
- `user` — current user object with role
- Auto-refresh: axios interceptor detects 401 → tries refresh → retries original request
- On app load: check localStorage for refresh token → try refresh → restore session

**Acceptance Criteria:**
- Login page renders with no console errors
- Successful login redirects to /dashboard
- Failed login shows error message ("Invalid username or password")
- Loading spinner on button during API call
- Token refresh happens automatically on 401
- Page refresh preserves session (auto-refresh from localStorage)

**Definition of Done:**
- Can log in as admin user
- Can refresh the page and remain logged in
- Invalid credentials show appropriate error

---

### Task 14: Build App Layout (Frontend)

**Objective:** Create the main application layout with sidebar (desktop), bottom nav (mobile), header, and protected route wrapper.

**Files to Create:**
- `frontend/src/components/layout/AppLayout.jsx`
- `frontend/src/components/layout/Sidebar.jsx`
- `frontend/src/components/layout/BottomNav.jsx`
- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/layout/ProtectedRoute.jsx`
- `frontend/src/pages/NotFoundPage.jsx`

**Files to Modify:**
- `frontend/src/App.jsx` (wrap protected routes in AppLayout, add ProtectedRoute)

**Dependencies:** Task 13

**Layout Specs (from UI/UX Design Brief):**

**Sidebar (desktop ≥ 1024px):**
- Fixed left, 240px wide, full height
- Top: DSP logo/initials in blue
- Nav items with icons: Dashboard, Add Entry, Transactions, Reports, Settings
- Active item highlighted with accent blue
- Bottom: User info (name, role) + logout button
- Settings visible only to admin

**Bottom Nav (mobile < 768px):**
- Fixed bottom, full width
- 4 tabs with icons: Dashboard, Add (prominent +), Transactions, Reports
- Settings accessible from header gear icon

**Header:**
- Top bar with page title, user avatar/name, settings icon (mobile)
- Breadcrumb or page title

**Tablet (768-1023px):**
- Collapsed sidebar (icons only, 64px wide)

**ProtectedRoute:**
- Checks `isAuthenticated` — redirects to /login if not
- Checks `user.role` against allowed roles — shows "Access Denied" if not authorized
- Renders child route if authorized

**Acceptance Criteria:**
- Desktop: sidebar visible with 5 nav items, content area to the right
- Mobile: no sidebar, bottom nav with 4 tabs
- Tablet: collapsed sidebar with icons
- Active nav item visually highlighted
- Unauthenticated users redirected to login
- Unauthorized role shows access denied message

**Definition of Done:**
- Navigate between pages using sidebar/bottom nav
- Responsive layout works at 375px, 768px, 1024px
- Logout button works

---

## Phase 2: Core Features

---

### Task 15: Build Customer Model, Service, Controller & Routes (Backend)

**Objective:** Full customer CRUD backend.

**Files to Create:**
- `backend/src/models/customerModel.js`
- `backend/src/services/customerService.js`
- `backend/src/controllers/customerController.js`
- `backend/src/routes/customerRoutes.js`
- `backend/src/validators/customerValidators.js`

**Files to Modify:**
- `backend/src/routes/index.js` (register customer routes)

**Dependencies:** Task 11, Task 12

**Endpoints:**
- `GET /api/v1/customers` — list with search, pagination, total paid amounts
- `POST /api/v1/customers` — create (admin, operator)
- `GET /api/v1/customers/:id` — single customer detail
- `PUT /api/v1/customers/:id` — update (admin only)
- `GET /api/v1/customers/:id/ledger` — all transactions for customer

**Acceptance Criteria:**
- Search by name (ILIKE) works
- Customers include `totalPaid` aggregation
- Customer creation validates name required, phone optional
- Ledger returns paginated transactions for that customer
- All mutations audit logged

**Definition of Done:**
- All 5 endpoints return correct data with proper status codes
- Integration tests pass

---

### Task 16: Build Category Model, Service, Controller & Routes (Backend)

**Objective:** Category CRUD backend (admin-only for mutations).

**Files to Create:**
- `backend/src/models/categoryModel.js`
- `backend/src/services/categoryService.js`
- `backend/src/controllers/categoryController.js`
- `backend/src/routes/categoryRoutes.js`
- `backend/src/validators/categoryValidators.js`

**Files to Modify:**
- `backend/src/routes/index.js` (register category routes)

**Dependencies:** Task 11, Task 12

**Endpoints:**
- `GET /api/v1/categories` — list all with total spent
- `POST /api/v1/categories` — create (admin only)
- `PUT /api/v1/categories/:id` — update (admin only)

**Acceptance Criteria:**
- Categories include `totalSpent` and `transactionCount` aggregation
- Only admin can create/update
- Deactivated categories still appear in historical data

**Definition of Done:**
- All endpoints return correct data
- Operator gets 403 on POST/PUT

---

### Task 17: Build Transaction Model (Backend)

**Objective:** Create the core transaction database query functions.

**Files to Create:**
- `backend/src/models/transactionModel.js`

**Files to Modify:** None

**Dependencies:** Task 07

**Functions:**
- `create(transactionData)` — insert transaction, return created record with UUID
- `findByPublicId(publicId)` — get single transaction with customer/category joined
- `findAll({ type, categoryId, customerId, paymentMode, dateFrom, dateTo, search, minAmount, maxAmount, page, limit, sortBy, sortOrder })` — filtered, paginated list
- `update(publicId, updateData)` — update fields, return old and new values
- `softDelete(publicId)` — set deleted_at
- `findDuplicates(type, amount, date, customerId, categoryId, windowMinutes)` — duplicate detection
- `getDashboardSummary(dateFrom, dateTo)` — aggregation: total intake, total outtake, category breakdown
- `getTodayTransactions(limit)` — most recent today's transactions

**Acceptance Criteria:**
- All queries use parameterized placeholders
- Filters are composable (any combination works)
- Pagination returns correct total count
- Soft-deleted records excluded from all queries (except explicit include)
- JOIN with customers and categories for display names

**Definition of Done:**
- Unit tests verify filter combinations
- Pagination math correct (total, totalPages)

---

### Task 18: Build Transaction Service (Backend)

**Objective:** Business logic for transaction operations — validation, duplicate detection, warnings.

**Files to Create:**
- `backend/src/services/transactionService.js`

**Files to Modify:** None

**Dependencies:** Task 17

**Business Rules:**
- Intake transactions MUST have customerId
- Outtake transactions MUST have categoryId
- Check for duplicate: same type + amount + date + (customer or category) within 10 minutes → return warning
- Amount > 10,00,000 (1 million) → return `large_amount` warning
- Negative balance check: if outtake would make total balance negative → return `negative_balance` warning
- Warnings are advisory, not blocking

**Functions:**
- `createTransaction(data, userId)` → `{ transaction, warnings[] }`
- `updateTransaction(publicId, data, userId)` → `{ transaction, oldValues }`
- `deleteTransaction(publicId, adminPassword, userId)` → requires password verification
- `getTransactionList(filters)` → `{ transactions, pagination }`
- `getTransactionDetail(publicId)` → full transaction with joins

**Acceptance Criteria:**
- Duplicate warning returned when conditions match
- Large amount warning returned for amounts > 10,00,000
- Delete requires valid admin password
- All mutations create audit log entries

**Definition of Done:**
- Unit tests for each business rule
- Warnings correctly aggregated in response

---

### Task 19: Build Transaction Controller, Routes & Validators (Backend)

**Objective:** Wire up transaction endpoints.

**Files to Create:**
- `backend/src/controllers/transactionController.js`
- `backend/src/routes/transactionRoutes.js`
- `backend/src/validators/transactionValidators.js`

**Files to Modify:**
- `backend/src/routes/index.js` (register transaction routes)

**Dependencies:** Task 18

**Endpoints (from API_REVIEW.md):**
- `GET /api/v1/transactions` — all roles
- `POST /api/v1/transactions` — admin, operator
- `GET /api/v1/transactions/:id` — all roles
- `PUT /api/v1/transactions/:id` — admin only
- `DELETE /api/v1/transactions/:id` — admin only

**Acceptance Criteria:**
- POST validates all fields per API_REVIEW.md spec
- GET supports all query parameters for filtering
- PUT requires admin role
- DELETE requires admin role + password in body
- Response includes warnings array when applicable

**Definition of Done:**
- Integration tests for all 5 endpoints
- Validation errors return field-level messages
- RBAC enforced

---

### Task 20: Build Dashboard Service & Endpoint (Backend)

**Objective:** Dashboard summary aggregation with caching.

**Files to Create:**
- `backend/src/services/dashboardService.js`
- `backend/src/services/cacheService.js`
- `backend/src/controllers/dashboardController.js`
- `backend/src/routes/dashboardRoutes.js`

**Files to Modify:**
- `backend/src/routes/index.js` (register dashboard routes)

**Dependencies:** Task 17

**Dashboard Data (from API_REVIEW.md):**
- totalIntake, totalOuttake, currentBalance (including opening_balance from settings)
- thisMonthIntake, thisMonthOuttake, thisMonthNet
- lastMonthNet, monthOverMonthChange (percentage)
- categoryBreakdown: array of { name, colorHex, total, percentage }
- todayTransactions: last 10 transactions from today
- todayIntake, todayOuttake

**Caching:**
- Cache dashboard results using node-cache with 5-minute TTL
- Cache key includes date range params
- Invalidate cache on transaction create/update/delete

**Acceptance Criteria:**
- Dashboard endpoint returns all required fields
- Balance includes opening_balance from app_settings
- Category breakdown percentages sum to 100
- Month-over-month change is correct percentage
- Cached response returns in < 50ms
- Cache invalidated after transaction mutation

**Definition of Done:**
- API returns correct aggregated data
- Second call within 5 minutes returns cached data (faster)
- Creating a transaction invalidates cache

---

### Task 21: Build Dashboard Page (Frontend)

**Objective:** Dashboard UI with 4 summary cards, category pie chart, and today's transactions.

**Files to Create:**
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/components/dashboard/SummaryCards.jsx`
- `frontend/src/components/dashboard/CategoryPieChart.jsx`
- `frontend/src/components/dashboard/TodayTransactions.jsx`
- `frontend/src/api/dashboardApi.js`
- `frontend/src/hooks/useDashboard.js`

**Files to Modify:**
- `frontend/src/App.jsx` (add /dashboard route)

**Dependencies:** Task 14, Task 20

**Install:** `chart.js react-chartjs-2`

**UI Specs (from UI/UX Design Brief Section 5.1):**
- 4 cards in 2x2 grid (mobile) or 4-column row (desktop):
  - Card 1: Total Intake — large green number, upward arrow icon
  - Card 2: Total Expenses — large red number, downward arrow icon
  - Card 3: Current Balance — large blue number (green if positive, red if negative)
  - Card 4: This Month — net flow with trend percentage vs last month
- Below cards: Category pie chart (using colors from category data)
- Below chart: Today's transactions list (clickable rows)
- Loading: Skeleton cards while data loads
- Numbers formatted in Indian notation (₹15,00,000)

**Acceptance Criteria:**
- Dashboard loads and displays all 4 cards with real data
- Pie chart renders category breakdown with correct colors
- Today's transactions show most recent 10
- Mobile: 2x2 card grid, full-width chart and list
- Loading skeletons shown while API call in progress
- Numbers in Indian format (₹ prefix, lakh/crore commas)

**Definition of Done:**
- Dashboard looks polished and professional
- All numbers match API response
- Responsive at 375px, 768px, 1024px

---

### Task 22: Build Add Entry Page — Intake Form (Frontend)

**Objective:** Intake transaction form with customer typeahead, amount formatting, and review modal.

**Files to Create:**
- `frontend/src/pages/AddEntryPage.jsx` (tab switcher: Intake / Outtake)
- `frontend/src/components/transactions/IntakeForm.jsx`
- `frontend/src/components/transactions/ReviewModal.jsx`
- `frontend/src/components/common/AmountInput.jsx`
- `frontend/src/api/transactionApi.js`
- `frontend/src/api/customerApi.js`
- `frontend/src/hooks/useCustomers.js`
- `frontend/src/hooks/useDebounce.js`

**Files to Modify:**
- `frontend/src/App.jsx` (add /add-entry route)

**Dependencies:** Task 15, Task 19, Task 21

**Form Fields (from App Flow Section 3.3):**
- Customer Name: typeahead/autocomplete from existing customers + "Add New" option
- Plot Number: text input (optional)
- Amount: AmountInput component (large font, ₹ prefix, auto-comma formatting)
- Payment Mode: pill/chip selectors — Cash, Cheque, UPI, Bank Transfer
- Date: date input, auto-filled to today, editable
- Notes: textarea (optional)
- Reference Number: text input (optional, shown for cheque/UPI/bank_transfer)

**Flow:**
1. Fill form → tap "Review"
2. Review modal shows read-only summary
3. Tap "Confirm & Save" → POST to API
4. Success screen: "Intake recorded! ₹X from [Customer]" with updated balance
5. Options: "Add Another" or "Go to Dashboard"

**Acceptance Criteria:**
- Customer typeahead searches as user types (debounced 300ms)
- "Add New Customer" option creates customer inline
- Amount auto-formats with commas as user types
- Date defaults to today
- Payment mode pills are visually selectable
- Review modal shows all entered data
- Success screen shows recorded amount and updated balance
- Form resets after successful save
- Validation errors shown inline under each field

**Definition of Done:**
- Can complete full intake flow: enter → review → save → success
- Customer typeahead works with existing customers
- Amount formatting correct (₹15,00,000)

---

### Task 23: Build Add Entry Page — Outtake Form (Frontend)

**Objective:** Outtake transaction form with category chips and review flow.

**Files to Create:**
- `frontend/src/components/transactions/OuttakeForm.jsx`
- `frontend/src/api/categoryApi.js`

**Files to Modify:**
- `frontend/src/pages/AddEntryPage.jsx` (add Outtake tab content)

**Dependencies:** Task 16, Task 22

**Form Fields (from App Flow Section 3.4):**
- Category: large pill/chip selectors with category colors
- Sub-description: text input (e.g., "Phase 2 road leveling")
- Amount: AmountInput component
- Payment Mode: Cash / Cheque / UPI (pill selectors)
- Paid To: text input (vendor/contractor name, optional)
- Date: date input (auto-filled to today)
- Notes / Bill Number: text input (optional)

**Acceptance Criteria:**
- Category chips load from API with correct colors
- Tab switching between Intake/Outtake preserves form state
- Same review → confirm → success flow as intake
- Warnings displayed: large amount, negative balance

**Definition of Done:**
- Can complete full outtake flow
- Category chips styled with DB colors

---

### Task 24: Build Transaction List Page (Frontend)

**Objective:** Paginated, filterable transaction list with search.

**Files to Create:**
- `frontend/src/pages/TransactionsPage.jsx`
- `frontend/src/components/transactions/TransactionList.jsx`
- `frontend/src/components/transactions/TransactionRow.jsx`
- `frontend/src/components/transactions/TransactionFilters.jsx`
- `frontend/src/components/transactions/TransactionDetail.jsx`
- `frontend/src/components/common/Pagination.jsx`
- `frontend/src/components/common/DatePicker.jsx`
- `frontend/src/hooks/useTransactions.js`

**Files to Modify:**
- `frontend/src/App.jsx` (add /transactions route)

**Dependencies:** Task 19, Task 21

**UI Specs (from App Flow Section 3.5 & UI Brief Section 5.3):**
- Filter bar: Date Range | Type (All/Intake/Outtake) | Category dropdown | Payment mode
- Search box: customer name, amount, description
- Transaction rows: colored circle (green/red), date, customer/category, amount, description
- Tap row: expand to detail view
- Admin: Edit and Delete buttons in detail view
- Pagination at bottom

**Acceptance Criteria:**
- Transactions load newest-first with pagination
- All filters work individually and in combination
- Search filters by customer name, description, or paid_to
- Transaction detail opens on row click
- Admin sees edit/delete buttons, operator does not
- Empty state when no results match filters

**Definition of Done:**
- List shows real transaction data
- Filters reduce results correctly
- Pagination works (next/prev/page numbers)
- Responsive on mobile (cards instead of table rows)

---

### Task 25: Build Transaction Edit & Delete (Frontend)

**Objective:** Admin-only edit modal and delete confirmation dialog.

**Files to Create:**
- (Most components already created — this task adds edit/delete logic)

**Files to Modify:**
- `frontend/src/components/transactions/TransactionDetail.jsx` (add edit/delete buttons)
- `frontend/src/pages/TransactionsPage.jsx` (handle edit/delete callbacks)

**Dependencies:** Task 24

**Edit Flow:**
- Admin clicks "Edit" on transaction detail
- Modal opens with pre-filled form (same as create form but in edit mode)
- Save → PUT to API → success toast → refresh list

**Delete Flow:**
- Admin clicks "Delete" on transaction detail
- ConfirmDialog opens: "Are you sure you want to delete this transaction?"
- Password input field in dialog
- Confirm → DELETE to API with password → success toast → refresh list

**Acceptance Criteria:**
- Edit pre-fills all fields correctly
- Edit saves changes via PUT
- Delete requires password re-entry
- Delete shows confirmation dialog with transaction details
- Both operations show success/error toasts
- Operator users do not see edit/delete buttons

**Definition of Done:**
- Admin can edit a transaction and see updated data
- Admin can delete a transaction (soft delete)
- Deleted transaction disappears from list
- Audit trail created for both operations

---

## Phase 3: Reports, Export & Settings

---

### Task 26: Build Report Endpoints (Backend)

**Objective:** All 4 report types + export endpoint.

**Files to Create:**
- `backend/src/services/reportService.js`
- `backend/src/controllers/reportController.js`
- `backend/src/routes/reportRoutes.js`
- `backend/src/validators/reportValidators.js`

**Files to Modify:**
- `backend/src/routes/index.js` (register report routes)

**Dependencies:** Task 17

**Endpoints:**
- `GET /api/v1/reports/daily?date=YYYY-MM-DD`
- `GET /api/v1/reports/monthly?month=M&year=YYYY`
- `GET /api/v1/reports/category?category_id=UUID&date_from=&date_to=`
- (Customer ledger already exists at GET /api/v1/customers/:id/ledger)

**Acceptance Criteria:**
- Daily report returns all transactions for the date with totals
- Monthly report returns category breakdown, weekly trend, totals
- Category report returns all expenses in category with date filter
- All reports support pagination
- Date validation: valid format, not future

**Definition of Done:**
- All report endpoints return correct aggregated data
- Integration tests pass

---

### Task 27: Build Reports Page (Frontend)

**Objective:** Reports page with 4 report types, date/filter controls, and data tables.

**Files to Create:**
- `frontend/src/pages/ReportsPage.jsx`
- `frontend/src/components/reports/DailyReport.jsx`
- `frontend/src/components/reports/MonthlyReport.jsx`
- `frontend/src/components/reports/CustomerLedger.jsx`
- `frontend/src/components/reports/CategoryReport.jsx`
- `frontend/src/components/reports/ExportButtons.jsx`
- `frontend/src/api/reportApi.js`
- `frontend/src/components/common/Table.jsx` (full-featured: sortable, zebra striping, sticky header)

**Files to Modify:**
- `frontend/src/App.jsx` (add /reports route)

**Dependencies:** Task 26

**UI Specs (from UI Brief Section 5.4):**
- Horizontal pill tabs at top: Daily | Monthly | Customer | Category
- Each tab has its own filter controls (date picker, month selector, customer search, category dropdown)
- Data displayed in zebra-striped tables with sticky headers
- Export buttons (PDF + Excel) right-aligned above each table
- Totals row at bottom of each table

**Acceptance Criteria:**
- All 4 report types render correctly
- Tab switching loads correct report with controls
- Tables display real data with proper formatting
- Totals calculated correctly
- Empty state when no data for selected period

**Definition of Done:**
- Can view each report type with real data
- Report data matches dashboard aggregations

---

### Task 28: Build PDF & Excel Export (Frontend)

**Objective:** Client-side export of any report to PDF or Excel.

**Files to Create:**
- `frontend/src/utils/exportPdf.js`
- `frontend/src/utils/exportExcel.js`

**Files to Modify:**
- `frontend/src/components/reports/ExportButtons.jsx` (wire up export functions)

**Dependencies:** Task 27

**Install:** `jspdf jspdf-autotable exceljs file-saver`

**PDF Spec:**
- Header: "DS Properties" + report title + date range
- Table with column headers and data rows
- Footer: generated date/time
- A4 landscape for wide tables

**Excel Spec:**
- Header row with bold formatting
- Data rows with proper column widths
- Numbers formatted as currency (₹ format)
- Sheet name = report type

**Acceptance Criteria:**
- PDF downloads with correct filename (e.g., "Daily_Report_2025-06-15.pdf")
- Excel downloads with correct filename
- Both contain all visible table data
- Indian currency formatting preserved in export

**Definition of Done:**
- Can export each report type to both PDF and Excel
- Exported files open correctly in PDF viewer and Excel/Google Sheets

---

### Task 29: Build User Management (Backend + Frontend)

**Objective:** Admin CRUD for managing system users.

**Files to Create:**
- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`
- `backend/src/validators/userValidators.js`
- `frontend/src/api/userApi.js`

**Files to Modify:**
- `backend/src/routes/index.js` (register user routes)
- `frontend/src/pages/SettingsPage.jsx` (create if not exists, add user management tab)

**Dependencies:** Task 08, Task 11

**Endpoints:**
- `GET /api/v1/users` — admin only
- `POST /api/v1/users` — admin only
- `PUT /api/v1/users/:id` — admin only (update name, role, isActive)
- `PUT /api/v1/users/:id/reset-password` — admin only

**UI:**
- User list table: Name, Username, Role, Status (active/inactive), Last Login
- "Add User" button → modal with name, username, password, role selector
- Edit button → modal to update name, role, active status
- Reset Password button → modal with new password field
- Cannot deactivate the last admin user (backend validation)

**Acceptance Criteria:**
- Admin can create new users with operator or viewer role
- Admin can deactivate users (soft disable)
- Admin can reset another user's password
- Last admin cannot be deactivated (error returned)
- Non-admin users get 403

**Definition of Done:**
- Full user lifecycle: create → use → deactivate
- Role changes take effect on next login

---

### Task 30: Build Settings Page (Frontend)

**Objective:** Settings page with tabs for categories, app settings, and change password.

**Files to Create:**
- `frontend/src/pages/SettingsPage.jsx` (or complete if partially created)
- `frontend/src/api/settingsApi.js`

**Files to Modify:**
- `frontend/src/App.jsx` (add /settings route, admin-only)

**Dependencies:** Task 16, Task 29

**Settings Tabs:**
1. **User Management** (admin) — from Task 29
2. **Categories** (admin) — manage categories: edit name, color, order, active status
3. **App Settings** (admin) — opening balance, company name
4. **Change Password** (all roles) — current password + new password form

**Acceptance Criteria:**
- Category management: edit name/color/order, toggle active
- Opening balance editable and saved to app_settings
- Change password validates current password
- Non-admin users only see "Change Password" tab

**Definition of Done:**
- All settings tabs functional
- Changes persist across page refreshes

---

### Task 31: Build Audit Log Viewer (Backend + Frontend)

**Objective:** Admin-only audit trail viewer.

**Files to Create:**
- `backend/src/controllers/auditController.js`
- `backend/src/routes/auditRoutes.js`
- `backend/src/validators/commonValidators.js` (pagination, date range schemas)

**Files to Modify:**
- `backend/src/routes/index.js` (register audit routes)
- `frontend/src/pages/SettingsPage.jsx` (add Audit Log tab for admin)

**Dependencies:** Task 12

**Endpoint:** `GET /api/v1/audit-logs?user_id=&action=&table_name=&date_from=&date_to=&page=&limit=`

**UI:**
- Table: Timestamp, User, Action, Table, Record ID, Changes
- Filters: user dropdown, action type, date range
- "Changes" column: shows summary (e.g., "Amount: ₹50,000 → ₹55,000")

**Acceptance Criteria:**
- Admin can view all audit entries
- Filters work correctly
- JSONB old/new values displayed in human-readable format

**Definition of Done:**
- Audit log shows all mutations since system start
- Filterable by user, action, date

---

## Phase 4: Testing, Polish & Deployment

---

### Task 32: Backend Unit Tests

**Objective:** Unit tests for services, validators, and utilities.

**Files to Create:**
- `backend/tests/unit/services/authService.test.js`
- `backend/tests/unit/services/transactionService.test.js`
- `backend/tests/unit/services/dashboardService.test.js`
- `backend/tests/unit/services/reportService.test.js`
- `backend/tests/unit/validators/transactionValidators.test.js`
- `backend/tests/unit/utils/formatters.test.js`
- `backend/tests/helpers/testSetup.js` (test DB setup, cleanup)

**Acceptance Criteria:**
- Auth service: all login scenarios (success, failure, lockout, token refresh)
- Transaction service: CRUD, duplicate detection, warnings, RBAC
- Dashboard service: aggregation accuracy, cache behavior
- Validators: valid and invalid inputs for all schemas
- Coverage > 80% on services and validators

**Definition of Done:**
- `npm test` runs all tests and passes
- No test depends on production database

---

### Task 33: Backend Integration Tests

**Objective:** API-level integration tests using supertest.

**Files to Create:**
- `backend/tests/integration/auth.test.js`
- `backend/tests/integration/transactions.test.js`
- `backend/tests/integration/customers.test.js`
- `backend/tests/integration/dashboard.test.js`
- `backend/tests/integration/reports.test.js`

**Acceptance Criteria:**
- Auth: login, refresh, logout, change password, lockout
- Transactions: CRUD with validation, filters, pagination, RBAC
- Customers: CRUD, search, ledger
- Dashboard: summary accuracy, cache invalidation
- Reports: all 4 types with date filters
- All tests use a separate test database

**Definition of Done:**
- All integration tests pass
- Database cleaned between test suites

---

### Task 34: Balance Accuracy Verification

**Objective:** Verify that computed balance matches expected manual calculations.

**Files to Create:**
- `backend/tests/integration/balanceAccuracy.test.js`

**Dependencies:** Task 33

**Test Plan:**
- Seed 100+ transactions (mix of intake/outtake)
- Manually compute expected balance
- Assert dashboard balance matches
- Assert customer ledger totals match
- Assert category report totals match
- Test with opening_balance > 0
- Test after soft-deleting transactions

**Acceptance Criteria:**
- Balance = opening_balance + SUM(intake amounts) - SUM(outtake amounts) where deleted_at IS NULL
- All report totals internally consistent
- No floating-point precision errors

**Definition of Done:**
- 100% balance accuracy on test dataset

---

### Task 35: Loading States, Empty States & Error Polish (Frontend)

**Objective:** Add skeleton loaders, empty states, and user-friendly error handling across all pages.

**Files to Modify:**
- All page components (DashboardPage, TransactionsPage, ReportsPage, SettingsPage)
- All list components (add empty states)

**Dependencies:** Task 24, Task 27, Task 30

**Requirements:**
- Dashboard: skeleton cards while loading
- Transaction list: skeleton rows while loading, empty state when no results
- Reports: loading indicator while generating, empty state for no data
- Forms: button spinner on submit, disable double-click
- API errors: toast notification with user-friendly message (not raw error)
- 404 page for unknown routes
- Session expired: preserve form data in sessionStorage, redirect to login

**Acceptance Criteria:**
- No page shows a blank white screen during loading
- Every empty list has a helpful empty state message and icon
- Every API error shows a toast (not an alert or console error)
- Forms cannot be double-submitted

**Definition of Done:**
- All pages handle loading, empty, and error states gracefully

---

### Task 36: Mobile Responsiveness Audit

**Objective:** Verify and fix all pages at mobile (375px), tablet (768px), and desktop (1024px+) breakpoints.

**Files to Modify:**
- Various component and page files as needed

**Dependencies:** Task 35

**Audit Checklist:**
- [ ] Login page: centered, readable on 375px
- [ ] Dashboard: 2x2 card grid on mobile, 4-column on desktop
- [ ] Dashboard chart: full-width, readable on mobile
- [ ] Add Entry form: full-width fields, large touch targets (44x44px min)
- [ ] Transaction list: card layout on mobile, table on desktop
- [ ] Reports: stacked tables on mobile, side-by-side on desktop
- [ ] Settings: single column on mobile
- [ ] Sidebar: hidden on mobile, icons-only on tablet, full on desktop
- [ ] Bottom nav: visible on mobile, hidden on desktop
- [ ] All buttons: minimum 44x44px touch target
- [ ] All modals: full-screen on mobile, centered on desktop

**Definition of Done:**
- Screenshots/visual verification at 375px, 768px, 1024px
- No horizontal scrolling at any breakpoint
- All interactive elements are touch-friendly

---

### Task 37: Performance Testing

**Objective:** Verify NFR performance targets are met.

**Files to Create:**
- `backend/tests/performance/loadTest.js` (seed and test with 1000+ transactions)

**Dependencies:** Task 33

**Tests:**
- Seed database with 1,000 transactions
- Dashboard API: must respond < 500ms
- Transaction list with filters: must respond < 500ms
- Report endpoints: must respond < 2 seconds
- Frontend page load: must be < 2 seconds (Lighthouse audit)

**Definition of Done:**
- All API endpoints meet p95 < 500ms with 1,000 transactions
- Dashboard loads < 2 seconds

---

### Task 38: Production Deployment Configuration

**Objective:** Create deployment scripts and configuration for VPS production environment.

**Files to Create:**
- `scripts/deploy.sh` (pull latest, install deps, run migrations, restart PM2)
- `scripts/backup-cron.sh` (pg_dump to offsite storage)
- `backend/ecosystem.config.js` (PM2 configuration)
- `nginx/dsproperties.conf` (Nginx reverse proxy config)

**Files to Modify:**
- `README.md` (add production deployment instructions)

**Dependencies:** Task 37

**PM2 Config:**
- App name: "dsp-api"
- Script: "server.js"
- Instances: 2 (cluster mode)
- Max memory: 512MB
- Auto-restart on crash
- Log rotation

**Nginx Config:**
- Port 80 → redirect to 443
- Port 443 → proxy to Node.js on port 3000
- Static frontend files served directly
- SSL with Let's Encrypt
- Gzip compression

**Backup Cron:**
- pg_dump at 2:00 AM IST daily
- Upload to offsite storage (S3/Backblaze)
- Delete local dumps older than 7 days
- Log backup success/failure

**Acceptance Criteria:**
- `deploy.sh` handles full deploy cycle
- Nginx config proxies correctly
- PM2 auto-restarts on crash
- Backup cron runs daily

**Definition of Done:**
- All config files created
- Deployment steps documented in README

---

## Summary of All Tasks

| Phase | Task # | Title | Complexity |
|-------|--------|-------|-----------|
| 0 | 01 | Initialize Project Structure | Low |
| 0 | 02 | Initialize Backend Project | Low |
| 0 | 03 | Initialize Frontend Project | Low |
| 0 | 04 | Design System Foundation Components | Medium |
| 1 | 05 | Create Database Migrations | Medium |
| 1 | 06 | Create Seed Data Scripts | Low |
| 1 | 07 | Database Connection & Configuration | Low |
| 1 | 08 | Build User & Auth Models | Medium |
| 1 | 09 | Build Auth Service | High |
| 1 | 10 | Build Auth Controller, Routes & Validators | Medium |
| 1 | 11 | Build JWT Auth & Authorization Middleware | Medium |
| 1 | 12 | Build Audit Logging Middleware | Medium |
| 1 | 13 | Build Login Page (Frontend) | Medium |
| 1 | 14 | Build App Layout (Frontend) | Medium |
| 2 | 15 | Build Customer Backend | Medium |
| 2 | 16 | Build Category Backend | Low |
| 2 | 17 | Build Transaction Model | High |
| 2 | 18 | Build Transaction Service | High |
| 2 | 19 | Build Transaction Controller & Routes | Medium |
| 2 | 20 | Build Dashboard Backend | High |
| 2 | 21 | Build Dashboard Page (Frontend) | High |
| 2 | 22 | Build Intake Form (Frontend) | High |
| 2 | 23 | Build Outtake Form (Frontend) | Medium |
| 2 | 24 | Build Transaction List Page (Frontend) | High |
| 2 | 25 | Build Transaction Edit & Delete (Frontend) | Medium |
| 3 | 26 | Build Report Endpoints (Backend) | Medium |
| 3 | 27 | Build Reports Page (Frontend) | High |
| 3 | 28 | Build PDF & Excel Export | Medium |
| 3 | 29 | Build User Management | Medium |
| 3 | 30 | Build Settings Page | Medium |
| 3 | 31 | Build Audit Log Viewer | Low |
| 4 | 32 | Backend Unit Tests | Medium |
| 4 | 33 | Backend Integration Tests | Medium |
| 4 | 34 | Balance Accuracy Verification | Medium |
| 4 | 35 | Loading States & Error Polish | Medium |
| 4 | 36 | Mobile Responsiveness Audit | Medium |
| 4 | 37 | Performance Testing | Medium |
| 4 | 38 | Production Deployment Configuration | Medium |

**Total: 38 tasks** (reduced from initial 45 by combining related work)

---

## Recommended First Task

> **Start with Task 01: Initialize Project Structure**
>
> This has zero dependencies and establishes the foundation everything else builds on. Follow with Task 02 and Task 03 to complete the project skeleton before any feature work begins.
