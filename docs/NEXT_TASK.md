# DS Properties — Next Task

**Last Updated:** 2026-06-27  
**Source of Truth:** [PROJECT_REALITY_AUDIT.md](PROJECT_REALITY_AUDIT.md) — codebase verification  
**Previous Task:** Task 14 — Build App Layout (bugs fixed, lint clean, layout verified)

---

## Current Task

### Task 15: Build Customer Model, Service, Controller & Routes (Backend)

**Phase:** 2 — Core Features  
**Complexity:** Medium  
**Reference:** [AI_EXECUTION_PACK.md → Task 15](AI_EXECUTION_PACK.md)

---

### Objective

Full customer CRUD backend with search, pagination, and ledger.

---

### Files to Create

| File | Purpose |
|------|---------|
| `backend/src/models/customerModel.js` | Database queries for customers |
| `backend/src/services/customerService.js` | Business logic for customer CRUD |
| `backend/src/controllers/customerController.js` | Request handlers for customer endpoints |
| `backend/src/routes/customerRoutes.js` | Express router for customer endpoints |
| `backend/src/validators/customerValidators.js` | Joi validation schemas |

### Files to Modify

| File | Changes Required |
|------|-----------------|
| `backend/src/routes/index.js` | Register customer routes |

---

### Endpoints

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/v1/customers` | All authenticated | List with search, pagination, total paid |
| POST | `/api/v1/customers` | Admin, Operator | Create new customer |
| GET | `/api/v1/customers/:id` | All authenticated | Single customer detail |
| PUT | `/api/v1/customers/:id` | Admin only | Update customer |
| GET | `/api/v1/customers/:id/ledger` | All authenticated | All transactions for customer |

---

### Dependencies

- ✅ **Task 11:** JWT Auth & Authorization Middleware — coded, bugs fixed
- ✅ **Task 12:** Audit Logging Middleware — coded

---

### Acceptance Criteria

- [ ] Search by name (ILIKE) works
- [ ] Customers include `totalPaid` aggregation
- [ ] Customer creation validates name required, phone optional
- [ ] Ledger returns paginated transactions for that customer
- [ ] All mutations audit logged
- [ ] `npm run lint` passes (backend)

---

### Definition of Done

- All 5 endpoints return correct data with proper status codes
- Integration tests pass
- Task 15 marked complete in `PROJECT_STATUS.md`

---

### After Completion

1. Mark Task 15 as ✅ in `PROJECT_STATUS.md`
2. Update this file to **Task 16: Build Category Backend**
3. Add entry to `CHANGELOG.md`

---

## Upcoming Tasks (Preview)

| Order | Task # | Title | Depends On |
|-------|--------|-------|------------|
| **NOW →** | **15** | **Build Customer Backend** | Task 11, 12 ✅ |
| NEXT | 16 | Build Category Backend | Task 11, 12 |
| 3rd | 17 | Build Transaction Model | Task 15, Task 16 |
| 4th | 18 | Build Transaction Service & Routes | Task 17 |
