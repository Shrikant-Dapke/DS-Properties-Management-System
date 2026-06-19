# DS Properties — Architecture Decision Record (ADR)

**Purpose:** Every significant architectural decision is recorded here with reasoning, so future developers (human or AI) understand WHY choices were made — not just WHAT was chosen.

**Last Updated:** 2026-06-19

---

## Decision Index

| # | Decision | Date | Priority | Category |
|---|----------|------|----------|----------|
| ADR-001 | Use 3 user roles (admin, operator, viewer) | 2026-06-19 | Critical | Access Control |
| ADR-002 | Use UUIDs for all public-facing IDs | 2026-06-19 | Critical | Security |
| ADR-003 | Descope offline sync to Phase 2 | 2026-06-19 | High | Scope |
| ADR-004 | Move plot_number from customers to transactions table | 2026-06-19 | High | Database |
| ADR-005 | Add refresh_tokens table | 2026-06-19 | High | Auth |
| ADR-006 | Configure Tailwind CSS with custom design tokens | 2026-06-19 | Medium | Frontend |
| ADR-007 | Use Vite instead of CRA for React scaffolding | 2026-06-19 | Medium | Frontend |
| ADR-008 | Use raw pg library instead of ORM | 2026-06-19 | Medium | Backend |
| ADR-009 | Add app_settings table for configuration | 2026-06-19 | Medium | Database |
| ADR-010 | Implement tiered rate limiting | 2026-06-19 | Medium | Security |
| ADR-011 | Remove "outstanding" from Phase 1 customer ledger | 2026-06-19 | Medium | Scope |
| ADR-012 | Remove running balance from transaction list view | 2026-06-19 | Medium | Performance |
| ADR-013 | Use pino for structured logging | 2026-06-19 | Medium | Observability |
| ADR-014 | Use in-memory caching (node-cache) for dashboard | 2026-06-19 | Medium | Performance |
| ADR-015 | Add CHECK constraints on all enum-like VARCHAR fields | 2026-06-19 | High | Database |

---

## ADR-001: Use 3 User Roles (admin, operator, viewer)

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Access Control

### Context
The original documents were inconsistent:
- PRD defined 3 roles: Data Entry Operator, Business Owner, Site Supervisor
- App Flow defined only 2 roles: Admin, Operator
- Database schema only supported 2 role values

### Decision
Implement 3 roles with RBAC:
- `admin` — Full access (Business Owner)
- `operator` — Create transactions, view dashboard/reports (Office Staff)
- `viewer` — Read-only access to dashboard and reports (Site Supervisor)

### Reasoning
- The PRD explicitly identifies Site Supervisor as a stakeholder with a specific need (checking budgets and expenses)
- Adding a third role is trivial during initial development but expensive to retrofit
- The `viewer` role is a simple read-only restriction — minimal implementation overhead
- Satisfies the client's stated requirement without over-engineering

### Consequences
- `users.role` CHECK constraint includes 3 values
- Authorization middleware supports `authorize('admin', 'operator')` pattern
- Some screens (Settings, User Management) restricted to admin only
- Viewer role added to all relevant API permission checks

---

## ADR-002: Use UUIDs for All Public-Facing IDs

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Security

### Context
The original schema used `SERIAL` (auto-incrementing integer) as primary keys, exposed directly in API URLs (e.g., `/transactions/42`).

### Decision
Use a dual-ID strategy:
- `id SERIAL PRIMARY KEY` — internal database ID for joins and performance
- `public_id UUID DEFAULT gen_random_uuid() UNIQUE` — external ID used in all API requests and responses

### Reasoning
- Sequential IDs are predictable — attackers can enumerate all records by incrementing
- Exposes total record count to any authenticated user
- Enables IDOR (Insecure Direct Object Reference) attacks
- UUIDs are non-guessable, preventing enumeration
- Keeping SERIAL as internal PK preserves integer join performance
- PostgreSQL's `gen_random_uuid()` is fast and requires no extension

### Consequences
- All API endpoints accept and return UUIDs, never integer IDs
- Database queries JOIN on integer `id` internally
- UUID column indexed with UNIQUE constraint
- Slight increase in URL length (UUID vs integer)

---

## ADR-003: Descope Offline Sync to Phase 2

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Scope Management

### Context
The PRD requires "offline entry with sync when reconnected." The App Flow specifies "Entry queued locally (localStorage), synced when reconnected." However, the TRD has zero architecture for offline support — no service workers, no sync endpoints, no conflict resolution, no handling of JWT expiry during offline periods.

### Decision
Offline sync is descoped from Phase 1. Instead:
- Detect offline state and show a user-friendly message
- Preserve unsaved form data in sessionStorage (survives page refreshes)
- Do NOT attempt automatic background sync

### Reasoning
- Offline-first with sync is extremely complex: service workers, IndexedDB, conflict resolution, idempotency keys, token management during offline periods
- This alone could be 2-3 weeks of development
- The primary use case (office entry) assumes internet availability
- Building a stable online system first is prerequisite to adding offline later
- Form data preservation in sessionStorage handles the most common pain point (accidental page refresh)

### Consequences
- Phase 1 requires internet connection for all operations
- If user goes offline mid-entry, they see a "You're offline" message
- Form data survives page refreshes via sessionStorage
- Full offline-sync is planned for Phase 2 with proper architecture

---

## ADR-004: Move plot_number from Customers to Transactions

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Database Design

### Context
The original schema placed `plot_number VARCHAR(50)` on the `customers` table. But the App Flow shows Plot Number as a field in the intake transaction form — suggesting it's per-transaction, not per-customer.

### Decision
- Remove `plot_number` from `customers` table
- Add `plot_number VARCHAR(50) NULLABLE` to `transactions` table

### Reasoning
- A customer can buy multiple plots (or make payments for different plots over time)
- Storing on `customers` limits to one plot per customer
- The App Flow correctly treats it as per-transaction context
- This is a normalization improvement — plot number describes the transaction, not the customer

### Consequences
- Customer records are simpler (no plot_number)
- Each transaction can optionally reference which plot it's for
- Reporting can aggregate by plot number across customers
- Slightly more data entry per transaction (optional field)

---

## ADR-005: Add refresh_tokens Table

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Authentication

### Context
The TRD mentions refresh tokens (30-day validity) and a `JWT_REFRESH_SECRET` environment variable, but there is no database table for storing refresh tokens and no refresh API endpoint.

### Decision
Add a `refresh_tokens` table and `POST /api/v1/auth/refresh` endpoint.

### Reasoning
- Without server-side token storage, you cannot revoke individual sessions
- Cannot implement proper logout (token continues to be valid)
- Cannot detect token reuse (potential theft indicator)
- Admin cannot force-logout a user
- Standard security practice for any JWT-based auth system

### Consequences
- `refresh_tokens` table stores hashed tokens with expiry and revocation timestamps
- Login creates both access token (8hr) and refresh token (30d, stored in DB)
- Refresh endpoint exchanges refresh token for new access token
- Logout revokes the refresh token
- Password change revokes all refresh tokens for the user

---

## ADR-006: Configure Tailwind CSS with Custom Design Tokens

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Frontend Styling

### Context
The TRD specifies "React.js + Tailwind CSS." The UI/UX Design Brief defines specific hex colors, font sizes, and spacing values (custom design tokens). These are not inherently conflicting but need explicit integration.

### Decision
Use Tailwind CSS with a custom `tailwind.config.js` that maps the design brief's tokens as the Tailwind theme.

### Reasoning
- Tailwind's utility classes accelerate development
- Custom theme ensures design brief tokens are the default palette
- Developers use `text-primary` (which resolves to `#1E3A8A`) instead of ad-hoc hex values
- Prevents divergence between design spec and implementation
- Single source of truth for design tokens

### Consequences
- `tailwind.config.js` extends colors, fonts, and spacing to match the UI brief
- Default Tailwind colors are available but custom tokens are preferred
- All color usage should reference the design brief tokens

---

## ADR-007: Use Vite Instead of CRA for React Scaffolding

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Frontend Tooling

### Context
The TRD does not specify a build tool. React projects can be scaffolded with Create React App (CRA) or Vite.

### Decision
Use Vite for the React frontend.

### Reasoning
- CRA is deprecated / in maintenance mode as of 2023
- Vite provides significantly faster HMR (Hot Module Replacement)
- Vite build times are 10-50x faster than webpack (CRA)
- Vite is now the recommended approach by the React community
- Better ESM support and smaller production bundles

### Consequences
- Frontend scaffolded with `npm create vite@latest`
- Config file: `vite.config.js` (not webpack.config.js)
- Dev server runs on port 5173 by default
- API proxy configured in vite.config.js for development

---

## ADR-008: Use Raw pg Library Instead of ORM

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Backend Data Access

### Context
The TRD specifies PostgreSQL with the `pg` library. Alternative approaches include Knex.js (query builder), Prisma, or Sequelize (ORMs).

### Decision
Use the `pg` library directly with parameterized queries. No ORM.

### Reasoning
- Maximum control over SQL queries — critical for a financial system
- No ORM overhead or abstraction leaks
- Parameterized queries prevent SQL injection by design
- Dashboard aggregation queries are complex — ORMs often generate suboptimal SQL
- The application's data model is simple enough that an ORM adds complexity without benefit
- Easier to debug — SQL is visible, not hidden behind abstraction

### Consequences
- All database queries written as raw SQL with `$1, $2` placeholders
- Model layer contains query functions (not ORM models)
- Schema migrations are raw SQL files (not ORM migration DSL)
- Developers must know SQL (not just ORM API)

---

## ADR-009: Add app_settings Table for Configuration

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Database Design

### Context
The system needs an opening balance to accurately compute the current cash position. There is also a need for configurable values like company name (for report headers) and financial year start month.

### Decision
Add an `app_settings` table as a key-value store for system-wide configuration.

### Reasoning
- Opening balance is essential: without it, balance = 0 on day 1, which may not match reality
- Company name, currency symbol, and FY start are configurable without code changes
- Key-value table is simple, extensible, and admin-manageable
- Avoids hardcoding business-specific values

### Consequences
- `app_settings` table with `key VARCHAR UNIQUE`, `value TEXT`
- Seeded with: opening_balance=0, company_name, currency_symbol, financial_year_start_month
- Dashboard balance calculation: opening_balance + Σintake - Σouttake
- Admin can update settings from Settings page

---

## ADR-010: Implement Tiered Rate Limiting

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Security

### Context
The TRD specifies "max 100 requests/minute per IP" globally. This is too permissive for auth endpoints (brute force risk) and too restrictive for read endpoints (legitimate dashboard use).

### Decision
Implement tiered rate limiting:
- Auth endpoints: 10 req/min per IP
- Write endpoints (POST/PUT/DELETE): 30 req/min per user
- Read endpoints (GET): 200 req/min per user
- Global: 500 req/min per IP

### Reasoning
- Auth endpoints are the primary brute force target — need strict limits
- Read endpoints are legitimately high-frequency (dashboard, list, search)
- Per-user limits on write endpoints prevent abuse while allowing normal operation
- Global per-IP limit provides a safety net

### Consequences
- Multiple `express-rate-limit` instances with different configs
- Rate limit headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`) in responses
- 429 responses include `Retry-After` header

---

## ADR-011: Remove "Outstanding" from Phase 1 Customer Ledger

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Scope Management

### Context
The App Flow says customer ledger shows "all their payments and outstanding." But the schema has no concept of expected payment, plot price, or agreement amount.

### Decision
Phase 1 customer ledger shows "total paid" only, not "outstanding." Outstanding tracking deferred to Phase 2 with a proper plot pricing model.

### Reasoning
- Cannot compute outstanding without knowing what is owed
- Adding plot pricing requires a new entity (plot/agreement)
- This is feature scope creep that complicates Phase 1
- "Total paid" provides immediate value without the complexity

### Consequences
- Customer ledger shows: total paid, transaction count, payment history
- No "outstanding" or "balance due" fields in Phase 1
- Phase 2 can add plot pricing and outstanding calculation

---

## ADR-012: Remove Running Balance from Transaction List View

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Performance

### Context
The App Flow shows "Balance after" for each transaction row in the list. Computing running balance requires ordering ALL transactions up to each row — O(n) per row.

### Decision
Remove running balance from the transaction list. Show it only in customer ledger reports where it's most valuable.

### Reasoning
- Running balance on every row in a paginated, filtered list is computationally expensive
- Performance degrades as transaction count grows (10,000+ records)
- The general transaction list is for searching/filtering — running balance is more useful in ledger context
- Dashboard already shows the current total balance

### Consequences
- Transaction list rows show: date, type, amount, customer/category, description
- No "balance after" column in the general list
- Customer ledger report can optionally compute running balance for a single customer's transactions

---

## ADR-013: Use Pino for Structured Logging

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Observability

### Context
The TRD mentions no logging strategy. Production financial systems need observability.

### Decision
Use `pino` for structured JSON logging.

### Reasoning
- Pino is the fastest Node.js logger (low overhead in production)
- JSON output is parseable by log aggregation tools
- Supports log levels (debug, info, warn, error)
- `pino-pretty` for human-readable dev output
- Better than `console.log` or `morgan` alone

### Consequences
- All application logs use the pino instance
- HTTP request logging via pino (replacing morgan)
- Log levels configurable via environment variable
- Production logs are JSON, dev logs are human-readable

---

## ADR-014: Use In-Memory Caching for Dashboard

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Performance

### Context
Dashboard summary requires complex aggregation queries over the transactions table. As data grows, these queries become slower.

### Decision
Use `node-cache` (in-memory cache) with 5-minute TTL for dashboard summary data. Invalidate on transaction mutations.

### Reasoning
- Redis is overkill for 2-5 concurrent users
- In-memory cache is zero-dependency, zero-latency
- 5-minute TTL balances freshness and performance
- Cache invalidation on create/update/delete ensures reasonable accuracy
- Scales sufficiently for the expected user count

### Consequences
- First dashboard load per 5-minute window hits the database
- Subsequent loads within the window return cached data (< 10ms)
- Transaction create/update/delete clears the dashboard cache
- If the application process restarts, cache is cold (acceptable)

---

## ADR-015: Add CHECK Constraints on All Enum-Like VARCHAR Fields

**Date:** 2026-06-19  
**Author:** Architecture Review  
**Status:** Accepted  
**Category:** Data Integrity

### Context
The original schema uses VARCHAR for fields like `type`, `payment_mode`, and `role` but has no database-level constraints on allowed values.

### Decision
Add CHECK constraints:
```sql
CHECK (type IN ('intake', 'outtake'))
CHECK (payment_mode IN ('cash', 'cheque', 'upi', 'bank_transfer'))
CHECK (role IN ('admin', 'operator', 'viewer'))
CHECK (action IN ('create', 'update', 'delete', 'login', 'login_failed', 'logout', 'password_change'))
```

### Reasoning
- Application-level validation can be bypassed (direct DB access, bugs, migration scripts)
- Database-level constraints are the last line of defense for data integrity
- Invalid data in a financial system causes cascading calculation errors
- CHECK constraints have negligible performance impact

### Consequences
- Invalid values rejected at the database level with clear error messages
- Adding new enum values requires a migration to update the CHECK constraint
- Application validation should match database constraints
