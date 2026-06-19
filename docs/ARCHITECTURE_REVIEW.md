# DS Properties — Critical Architecture Review

**Reviewer Role:** Principal Engineer / Staff Software Architect  
**Review Date:** June 2025  
**Documents Reviewed:**

| # | Document | Pages | Focus |
|---|----------|-------|-------|
| 1 | DSP_PRD_Product_Requirements | 5 | Business goals, features, NFRs |
| 2 | DSP_TRD_Technical_Requirements | 4 | Stack, API, security, deployment |
| 3 | DSP_App_Flow | 4 | User journeys, screen flows |
| 4 | DSP_Backend_Schema_Implementation | 6 | DB schema, implementation phases |
| 5 | DSP_UI_UX_Design_Brief | 4 | Visual design, components, layout |

---

## Document Understanding Summary

### What the system IS:
A **Financial Tracking System (FTS)** for DS Properties — a land plotting business that divides land into plots and sells them to customers. The system tracks:
- **Intake:** Money received from customers (plot payments)
- **Outtake:** Money spent on construction (road, gutter, drainage, labor, materials, admin)
- **Balance:** Running cash balance (Intake minus Outtake)
- **Reports:** Daily, monthly, customer ledger, category reports with PDF/Excel export

### What the system is NOT:
- Not a CRM or plot sales/booking system
- Not a payroll system
- Not an inventory management system
- Not a tax/GST calculation system

### User Roles (as documented):
- **Data Entry Operator:** Daily transaction entry
- **Business Owner (Admin):** View summaries, edit/delete, manage users
- **Site Supervisor:** Check budgets and expense records

### Technology Stack (as proposed):
React.js + Tailwind CSS → Node.js + Express.js → PostgreSQL  
JWT + bcrypt auth | VPS deployment (DigitalOcean/Hostinger)

---

## PART 1: Cross-Document Inconsistencies

> [!CAUTION]
> These inconsistencies between documents MUST be resolved before development begins. Building on conflicting requirements will cause rework.

### INC-01: Three Roles vs Two Roles

| Priority | **CRITICAL** |
|----------|-------------|

- **PRD (Section 3)** defines **3 user roles:** Data Entry Operator, Business Owner, Site Supervisor
- **App Flow (Section 1)** defines only **2 roles:** Admin (Owner), Operator
- **Schema** has `role VARCHAR(20)` with values `'admin'` or `'operator'`

**Problem:** The Site Supervisor role is completely absent from the app flow, schema, and all screen designs. Either they are a real stakeholder with unique needs or they should be explicitly descoped.

**Recommendation:** Implement 3 roles with RBAC (Role-Based Access Control):
- `admin` — Full access (owner)
- `operator` — Create transactions, view dashboard/reports (no edit/delete/user-mgmt)
- `viewer` — Read-only access to dashboard and reports (Site Supervisor)

This is trivial to implement now but painful to retrofit later.

---

### INC-02: Expense Categories Mismatch

| Priority | **HIGH** |
|----------|---------|

- **PRD (Section 4.2)** lists 7 categories: Road Construction, Gutter/Drainage, **Boundary Wall**, Labor Charges, Materials, Admin & Legal, Other
- **App Flow (Section 3.4)** dropdown lists: Road, Gutter, Drainage, Labor, Materials, Admin, Other — **missing "Boundary Wall"**
- **Schema** uses a `expense_categories` table (dynamic, good) but seed data is unspecified

**Problem:** If the seeded categories don't match the PRD, the system launches with incomplete categorization.

**Recommendation:** Use the PRD's 7 categories as the canonical seed list. Add Boundary Wall. Make categories admin-manageable (already supported by schema).

---

### INC-03: Plot Number — Per-Customer vs Per-Transaction

| Priority | **HIGH** |
|----------|---------|

- **Schema** places `plot_number VARCHAR(50)` on the `customers` table
- **App Flow (Section 3.3)** shows Plot Number as a field in the **Intake transaction form**

**Problem:** A customer can buy multiple plots. Storing plot_number on `customers` limits to one plot per customer. The app flow correctly treats it as per-transaction context.

**Recommendation:**
- Remove `plot_number` from `customers` table
- Add `plot_number VARCHAR(50) NULLABLE` to `transactions` table
- This allows tracking which plot each payment is for

---

### INC-04: Offline Support — Promised but Unarchitected

| Priority | **HIGH** |
|----------|---------|

- **PRD (Section 5)** requires: "offline entry with sync when reconnected"
- **App Flow (Section 4)** mentions: "Entry queued locally (localStorage), synced when reconnected"
- **TRD** has **zero** mention of offline architecture, service workers, sync endpoints, or conflict resolution
- **Schema** has no `sync_status` or `local_id` columns

**Problem:** Offline-first with sync is an extremely complex feature. It requires: service workers, IndexedDB/localStorage queue, conflict resolution, idempotency keys, a sync API endpoint, and handling of token expiry during offline periods. This is weeks of work by itself.

**Recommendation:** **Descope offline to Phase 2.** For Phase 1, implement a simpler approach:
- Detect offline state and show a user-friendly message
- Preserve form data in sessionStorage so it survives page refreshes
- Do NOT attempt automatic background sync in Phase 1

---

### INC-05: Tailwind CSS vs Custom Design System

| Priority | **MEDIUM** |
|----------|-----------|

- **TRD** specifies: "React.js + Tailwind CSS"
- **UI/UX Brief** defines custom design tokens (specific hex values, font sizes, spacing values)

**Problem:** These approaches are not inherently conflicting — Tailwind can be configured with custom tokens — but the documents don't acknowledge this integration. Without explicit Tailwind configuration, developers may use default Tailwind classes that violate the design brief.

**Recommendation:** Configure `tailwind.config.js` to use the design brief's tokens as the Tailwind theme. This gives the best of both worlds: utility classes with the correct design language.

---

### INC-06: "Customer Outstanding" — No Schema Support

| Priority | **MEDIUM** |
|----------|-----------|

- **App Flow (Section 3.6)** says Customer Ledger shows "all their payments and **outstanding**"
- **Schema** has no concept of expected payment, plot price, or agreement amount

**Problem:** You cannot compute "outstanding" without knowing what the customer owes. The system only tracks what was received, not what is expected.

**Recommendation:** Either:
1. **Add a `plot_price` or `agreement_amount` field** to a customer-plot relationship to compute outstanding = agreed - received
2. **Remove the word "outstanding"** from the spec and show only "total paid" (simpler, sufficient for Phase 1)

Option 2 is recommended for Phase 1. Plot pricing can be added in Phase 2.

---

### INC-07: Mobile Navigation — 4 Tabs but 5 Sections

| Priority | **LOW** |
|----------|--------|

- **App Flow (Section 2)** lists 5 navigation sections: Dashboard, Add Entry, Transactions, Reports, Settings
- **UI Brief (Section 4.2)** shows bottom nav with 4 tabs: Dashboard, Add, Transactions, Reports

**Problem:** Settings is missing from mobile navigation.

**Recommendation:** Add Settings as an icon in the page header (gear icon) or as a 5th tab. Alternatively, place it behind a user avatar/menu in the header. Settings is rarely accessed, so header placement is acceptable.

---

## PART 2: PRD Review — Weak Decisions & Missing Requirements

### PRD-01: No Multi-Site / Multi-Project Support

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** The PRD assumes a single site/project. If DS Properties operates multiple plotting sites simultaneously (or sequentially), all transactions mix together with no project-level separation.

**Recommendation:** Add an optional `project` or `site` entity. Transactions can be optionally tagged with a project. Dashboard can filter by project. This is low-cost to add now (one extra table + FK) but expensive to retrofit.

**Decision Required from Client:** Does DS Properties manage multiple sites simultaneously?

---

### PRD-02: No Receipt/Bill Attachment Support

| Priority | **LOW** |
|----------|--------|

**Problem:** Construction expenses (outtake) often have physical bills/receipts. The system has no facility to attach photos of receipts. For a financial tracking system, this is a notable gap — especially when the site supervisor or owner needs to verify expenses.

**Recommendation:** Phase 2 feature — add optional image upload (S3/local storage) linked to transaction records.

---

### PRD-03: No Data Migration Plan

| Priority | **HIGH** |
|----------|---------|

**Problem:** The PRD says "DS Properties currently manages financial records manually — likely through paper ledgers or basic spreadsheets." There is no plan for migrating existing historical data into the new system.

**Recommendation:** Build a CSV/Excel import utility for initial data migration. Without historical data, the system launches with zero context, which reduces owner confidence and adoption.

---

### PRD-04: Success Metric — "100% Balance Accuracy" Not Verified

| Priority | **HIGH** |
|----------|---------|

**Problem:** The PRD requires "Balance accuracy: 100% match with manual count" but the schema computes balance dynamically (SUM of intake minus SUM of outtake). There is no reconciliation mechanism, no opening balance concept, and no way to handle discrepancies.

**Recommendation:**
- Add an `opening_balance` configuration value for system initialization
- Add a periodic reconciliation report that allows the owner to verify against bank statements
- Add balance snapshot/checkpoint mechanism for audit purposes

---

## PART 3: TRD Review — Technical Weaknesses

### TRD-01: SERIAL Integer IDs Exposed in API

| Priority | **CRITICAL** |
|----------|-------------|

**Problem:** The schema uses `SERIAL` (auto-incrementing integer) for all primary keys. These IDs are exposed in API URLs (`/transactions/42`). This is a security risk:
- Attackers can enumerate records by incrementing IDs
- Exposes total record count
- Facilitates IDOR (Insecure Direct Object Reference) attacks

**Recommendation:** Use **UUIDs** for all entity primary keys exposed in the API. Keep SERIAL as internal database IDs if needed for join performance, but expose UUIDs externally.

```
id          SERIAL PRIMARY KEY          -- internal
public_id   UUID DEFAULT gen_random_uuid()  -- external, indexed, unique
```

---

### TRD-02: Missing API Endpoints

| Priority | **CRITICAL** |
|----------|-------------|

The TRD defines 12 endpoints. The following are **missing**:

| Missing Endpoint | Reason Needed |
|-----------------|---------------|
| `POST /api/v1/auth/refresh` | Refresh token flow — TRD mentions refresh tokens but has no endpoint |
| `POST /api/v1/auth/logout` | Invalidate refresh token server-side |
| `PUT /api/v1/auth/change-password` | App flow mentions change password in Settings |
| `GET /api/v1/users` | User management (admin) |
| `POST /api/v1/users` | Create new operator user (admin) |
| `PUT /api/v1/users/:id` | Update/deactivate user (admin) |
| `POST /api/v1/customers` | Create new customer (needed for intake form) |
| `PUT /api/v1/customers/:id` | Update customer info |
| `PUT /api/v1/categories/:id` | Update category (admin) |
| `POST /api/v1/categories` | Create new category (admin) |
| `GET /api/v1/reports/category` | Category report endpoint |
| `GET /api/v1/reports/customer/:id` | Customer ledger (different from customers/:id/ledger?) |
| `GET /api/v1/health` | Health check for monitoring |
| `GET /api/v1/audit-logs` | Admin audit trail view |

**Recommendation:** See the complete API specification in `API_REVIEW.md`.

---

### TRD-03: No Refresh Token Storage

| Priority | **HIGH** |
|----------|---------|

**Problem:** TRD mentions refresh tokens (30-day validity) and a `JWT_REFRESH_SECRET` env var, but there is no `refresh_tokens` table in the schema and no refresh endpoint in the API. Without server-side token storage, you cannot:
- Revoke individual sessions
- Implement logout
- Detect token reuse (theft)

**Recommendation:** Add a `refresh_tokens` table:
```
refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, created_at)
```

---

### TRD-04: No Request Logging / Monitoring

| Priority | **HIGH** |
|----------|---------|

**Problem:** No mention of HTTP request logging, application monitoring, or error tracking. For a financial system handling real money, you need observability.

**Recommendation:**
- Use `morgan` or `pino` for structured HTTP request logging
- Use `winston` or `pino` for application logging
- Add a `/health` endpoint for uptime monitoring
- Consider Sentry (free tier) for error tracking in production

---

### TRD-05: Rate Limiting Configuration

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** 100 requests/minute per IP may be too restrictive for legitimate use. A user loading the dashboard, then navigating to transactions, then adding an entry could generate 15-20 API calls in rapid succession.

**Recommendation:** Tiered rate limiting:
- Auth endpoints: 10 requests/minute (brute force protection)
- Write endpoints: 30 requests/minute
- Read endpoints: 200 requests/minute
- Global: 500 requests/minute per IP

---

### TRD-06: No CSRF Protection Mentioned

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** TRD mentions CORS but not CSRF. While JWT bearer tokens in headers provide some CSRF protection (cookies aren't used), if tokens are ever stored in cookies for convenience, CSRF becomes a vulnerability.

**Recommendation:** Store JWT in httpOnly cookies with SameSite=Strict, or keep in memory/localStorage with explicit Authorization header. Document the chosen approach and its security implications.

---

## PART 4: Schema Review — Database Weaknesses

### DB-01: Missing `updated_at` on Multiple Tables

| Priority | **HIGH** |
|----------|---------|

**Problem:** The `customers` and `expense_categories` tables lack `updated_at` timestamps. The `users` table also lacks `updated_at`. Only `transactions` has it.

**Recommendation:** Add `updated_at TIMESTAMPTZ DEFAULT NOW()` to ALL tables. Use a database trigger to auto-update on row modification.

---

### DB-02: No CHECK Constraints

| Priority | **HIGH** |
|----------|---------|

**Problem:** Critical fields use VARCHAR with no CHECK constraints:
- `transactions.type` — should only be 'intake' or 'outtake'
- `transactions.payment_mode` — should only be 'cash', 'cheque', 'upi', 'bank_transfer'
- `users.role` — should only be 'admin', 'operator', 'viewer'

Without CHECK constraints, invalid data can be inserted, causing application-level bugs.

**Recommendation:** Add CHECK constraints:
```sql
CHECK (type IN ('intake', 'outtake'))
CHECK (payment_mode IN ('cash', 'cheque', 'upi', 'bank_transfer'))
CHECK (role IN ('admin', 'operator', 'viewer'))
```

---

### DB-03: No Composite Indexes for Common Queries

| Priority | **HIGH** |
|----------|---------|

**Problem:** Individual indexes exist on `transaction_date`, `type`, `customer_id`, `category_id` — but the most common queries combine these fields:
- Dashboard: `WHERE type = 'intake' AND deleted_at IS NULL`
- Monthly report: `WHERE transaction_date BETWEEN ... AND ... AND type = 'outtake'`
- Customer ledger: `WHERE customer_id = ? AND deleted_at IS NULL ORDER BY transaction_date`

Single-column indexes won't optimize these multi-condition queries efficiently.

**Recommendation:** Add composite indexes:
```sql
CREATE INDEX idx_txn_type_date ON transactions(type, transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_txn_customer_date ON transactions(customer_id, transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_txn_category_date ON transactions(category_id, transaction_date) WHERE deleted_at IS NULL;
```

---

### DB-04: Amount Column Allows Refunds Issue

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** `amount NUMERIC(15,2) NOT NULL, >0` — the constraint requires amount > 0. This prevents recording refunds, reversals, or adjustments. In a financial system, corrections are inevitable.

**Recommendation:** Keep amount > 0 but add a transaction subtype. Refunds are recorded as:
- Type: `intake`, Amount: positive, with a `is_reversal BOOLEAN DEFAULT FALSE` flag
- Or: Create a linked "reversal" transaction that references the original

For Phase 1, the reversal flag approach is simplest.

---

### DB-05: No Foreign Key ON DELETE Behavior

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** Foreign keys are defined but ON DELETE behavior is not specified. Default is `NO ACTION` which will throw errors if referenced records are deleted.

**Recommendation:**
- `transactions.customer_id` → `ON DELETE RESTRICT` (can't delete customer with transactions)
- `transactions.category_id` → `ON DELETE RESTRICT` (can't delete category with transactions)
- `transactions.created_by` → `ON DELETE RESTRICT` (can't delete user who created transactions)
- `audit_logs.user_id` → `ON DELETE RESTRICT` (preserve audit trail)

---

### DB-06: `transaction_date` is DATE, Not TIMESTAMPTZ

| Priority | **LOW** |
|----------|--------|

**Problem:** `transaction_date DATE` loses the time component. While the PRD describes daily transactions, knowing the time of day can be useful for:
- Ordering same-day transactions
- Duplicate detection (same amount + category within 5 minutes)
- Audit accuracy

**Recommendation:** Keep as `DATE` for the business date (which the user can backdate), but rely on `created_at TIMESTAMPTZ` for the actual entry time. This is already in the schema, so the current design is acceptable. No change needed.

---

## PART 5: App Flow Review — UX Weaknesses

### UX-01: No Password Reset Flow

| Priority | **HIGH** |
|----------|---------|

**Problem:** There is no "Forgot Password" flow. If an operator forgets their password, the only option is for the admin to reset it — but there's no admin endpoint for this either.

**Recommendation:** Since this is a small team (2-5 users), a full email-based reset flow is overkill. Instead:
- Admin can reset any user's password from the user management screen
- No self-service password reset needed for Phase 1

---

### UX-02: No Confirmation for Destructive Actions

| Priority | **HIGH** |
|----------|---------|

**Problem:** The app flow mentions admin can edit and delete transactions, but there is no confirmation dialog spec for delete operations. For a financial system, accidental deletions are catastrophic (even with soft delete, the user may not realize the mistake).

**Recommendation:** All delete actions require:
1. A confirmation modal: "Are you sure you want to delete this transaction of ₹X,XXX from [date]?"
2. Re-enter admin password for delete operations (as PRD mentions: "data not deletable without admin password")

---

### UX-03: "Running Balance" Per Transaction Row is Computationally Expensive

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** App Flow (Section 3.5) shows "Balance after" for each transaction row. Computing a running balance for every row in a paginated list requires ordering ALL transactions up to that point — this is an O(n) operation per row that worsens as data grows.

**Recommendation:** Two options:
1. **Remove running balance from list view** — show it only in detail view or reports
2. **Store computed running balance** on each transaction row (denormalization) — updated on insert via trigger or application logic

Option 1 is recommended for Phase 1. Running balance is most useful in the customer ledger report, not the general transaction list.

---

### UX-04: Duplicate Detection Logic is Naive

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** "If same amount + date + category entered within 5 min: 'Possible duplicate detected'" — this check misses several scenarios:
- Different categories but same amount/date (not a duplicate, correctly ignored)
- Same customer, same amount, same date but different plot (legitimate, incorrectly flagged)
- Exact same transaction entered 6 minutes apart (not caught)

**Recommendation:** Flag as potential duplicate when ALL of these match:
- Same `type` (intake/outtake)
- Same `amount`
- Same `transaction_date`
- Same `customer_id` (for intake) or same `category_id` (for outtake)
- Created within 10 minutes

Show as a warning, not a blocker. Let the user proceed.

---

### UX-05: No Loading States or Skeleton Screens Specified

| Priority | **LOW** |
|----------|--------|

**Problem:** No mention of loading indicators, skeleton screens, or optimistic updates in any document.

**Recommendation:** Define standard loading patterns:
- Dashboard cards: Skeleton shimmer placeholders
- Transaction list: Skeleton row placeholders (5 rows)
- Form submission: Button shows spinner, disable double-click
- Reports: Loading indicator with "Generating report..." message

---

## PART 6: Security Review — Gaps

### SEC-01: No Input Sanitization Strategy Beyond Joi

| Priority | **HIGH** |
|----------|---------|

**Problem:** TRD mentions Joi for validation but doesn't address:
- XSS in text fields (description, notes, customer name)
- HTML/script injection in any freeform text
- SQL injection is handled by parameterized queries ✓

**Recommendation:**
- Sanitize all text inputs with `DOMPurify` on frontend and `xss` or `sanitize-html` on backend
- Encode all output in React (JSX auto-escapes, but `dangerouslySetInnerHTML` must never be used)
- Add Content-Security-Policy headers

---

### SEC-02: No Account Lockout

| Priority | **HIGH** |
|----------|---------|

**Problem:** No mention of account lockout after failed login attempts. Without this, brute force attacks are limited only by rate limiting (100/min is too generous for auth).

**Recommendation:**
- Lock account for 15 minutes after 5 consecutive failed attempts
- Track failed attempts in `users` table: `failed_login_attempts INT DEFAULT 0`, `locked_until TIMESTAMPTZ`
- Auth-specific rate limit: 10 requests/minute per IP

---

### SEC-03: No Audit for Login Events

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** `audit_logs` tracks CRUD operations but not authentication events (login success, login failure, password change).

**Recommendation:** Log auth events to audit_logs with `table_name = 'auth'`:
- Login success
- Login failure (with username attempted)
- Password changed
- Token refreshed
- Logout

---

## PART 7: Scalability & Maintenance Risks

### SCALE-01: No Caching Strategy

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** Dashboard summary is a complex aggregation query hitting the transactions table. As transactions grow (1000+ records in year 1, 5000+ in year 2), this query becomes slower.

**Recommendation:** Implement dashboard summary caching:
- Cache dashboard aggregation results in Redis or in-memory (node-cache) with 5-minute TTL
- Invalidate cache on new transaction creation
- For a small system, in-memory cache is sufficient

---

### SCALE-02: No Database Connection Encryption

| Priority | **MEDIUM** |
|----------|-----------|

**Problem:** No mention of SSL/TLS for PostgreSQL connections. If DB and app server are on the same VPS, this is lower risk. If they're separated, data flows unencrypted.

**Recommendation:** Enable `ssl: { rejectUnauthorized: false }` in pg connection config for production. Document the network topology decision.

---

### SCALE-03: Single VPS — No Redundancy

| Priority | **LOW** (acceptable for Phase 1) |
|----------|--------------------------------|

**Problem:** Single VPS deployment means a single point of failure. If the VPS goes down, the system is completely unavailable.

**Recommendation:** Acceptable for Phase 1 given the business scale. For Phase 2:
- Automated snapshots (VPS provider feature)
- Offsite backup verification
- Documented disaster recovery procedure

---

## Summary of All Issues

| ID | Issue | Priority | Category |
|----|-------|----------|----------|
| INC-01 | 3 roles vs 2 roles mismatch | **Critical** | Cross-doc |
| INC-02 | Expense categories mismatch | High | Cross-doc |
| INC-03 | Plot number per-customer vs per-transaction | High | Cross-doc |
| INC-04 | Offline support unarchitected | High | Cross-doc |
| INC-05 | Tailwind vs custom design system | Medium | Cross-doc |
| INC-06 | "Outstanding" has no schema support | Medium | Cross-doc |
| INC-07 | Mobile nav has 4 tabs not 5 | Low | Cross-doc |
| PRD-01 | No multi-site/project support | Medium | PRD |
| PRD-02 | No receipt/bill attachment | Low | PRD |
| PRD-03 | No data migration plan | High | PRD |
| PRD-04 | Balance accuracy not verifiable | High | PRD |
| TRD-01 | SERIAL IDs exposed in API | **Critical** | TRD |
| TRD-02 | 14+ missing API endpoints | **Critical** | TRD |
| TRD-03 | No refresh token storage | High | TRD |
| TRD-04 | No request logging/monitoring | High | TRD |
| TRD-05 | Rate limiting too restrictive | Medium | TRD |
| TRD-06 | No CSRF protection mentioned | Medium | TRD |
| DB-01 | Missing updated_at on tables | High | Schema |
| DB-02 | No CHECK constraints | High | Schema |
| DB-03 | No composite indexes | High | Schema |
| DB-04 | Amount >0 prevents refunds | Medium | Schema |
| DB-05 | No ON DELETE behavior | Medium | Schema |
| DB-06 | transaction_date as DATE | Low | Schema |
| UX-01 | No password reset flow | High | App Flow |
| UX-02 | No delete confirmation spec | High | App Flow |
| UX-03 | Running balance per row expensive | Medium | App Flow |
| UX-04 | Duplicate detection too naive | Medium | App Flow |
| UX-05 | No loading states specified | Low | App Flow |
| SEC-01 | No XSS sanitization strategy | High | Security |
| SEC-02 | No account lockout | High | Security |
| SEC-03 | No auth event auditing | Medium | Security |
| SCALE-01 | No caching strategy | Medium | Scale |
| SCALE-02 | No DB connection encryption | Medium | Scale |
| SCALE-03 | Single VPS, no redundancy | Low | Scale |

**Total Issues Found: 33**
- Critical: 3
- High: 15
- Medium: 11
- Low: 4

---

## Revised Architecture Decisions

Based on this review, the following architectural decisions override or augment the original documents:

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Use UUIDs for all public-facing IDs | Prevent enumeration, IDOR attacks |
| 2 | Implement 3 roles: admin, operator, viewer | Honor PRD's Site Supervisor requirement |
| 3 | Move plot_number to transactions table | Support multi-plot customers |
| 4 | Descope offline sync to Phase 2 | Avoid scope creep, build stable Phase 1 first |
| 5 | Add refresh_tokens table | Enable secure token management |
| 6 | Add CHECK constraints on all enum-like fields | Prevent data corruption |
| 7 | Add composite indexes | Optimize common query patterns |
| 8 | Add updated_at to all tables with auto-trigger | Consistent auditing |
| 9 | Implement tiered rate limiting | Separate auth vs data endpoints |
| 10 | Add account lockout (5 attempts → 15 min lock) | Brute force protection |
| 11 | Configure Tailwind with design brief tokens | Resolve CSS approach conflict |
| 12 | Remove "outstanding" from Phase 1 | No schema support, add in Phase 2 |
| 13 | Add opening_balance config | Enable accurate balance tracking |
| 14 | Remove running balance from transaction list | Performance concern, show only in reports |
| 15 | Add structured logging (pino) | Production observability |
