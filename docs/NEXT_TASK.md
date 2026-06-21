# DS Properties — Next Task

**Last Updated:** 2026-06-21  
**Source of Truth:** [PROJECT_REALITY_AUDIT.md](PROJECT_REALITY_AUDIT.md) — codebase verification  
**Audit Reference:** Task 13 is coded but not complete; finish it before Task 14.

---

## Current Task

### Task 13 (Finish): Login Page — Fix Bugs, Verify, Close Acceptance Criteria

**Phase:** 1 — Database & Authentication  
**Complexity:** Medium  
**Reference:** [AI_EXECUTION_PACK.md → Task 13](AI_EXECUTION_PACK.md)

---

### Objective

Task 13 files already exist (`LoginPage.jsx`, `AuthContext.jsx`, `api/client.js`, `api/authApi.js`, `hooks/useAuth.js`). Complete remaining work:

1. **Fix critical backend bug:** `ForbiddenError` is imported in `authService.js` and `authorize.js` but not exported from `errors.js` — account lockout and 403 paths crash at runtime.
2. **Fix frontend ESLint:** Refactor `AuthContext.jsx` (split context export from provider; resolve `react-hooks/set-state-in-effect`).
3. **Verify with live database:** Start PostgreSQL, run migrations + seeds, test admin login end-to-end.
4. **Close Task 01/04 gaps:** Add `.nvmrc` (Node 20) and `formatINR` to `formatters.js`.

---

### Files Already Created (verify, do not recreate)

| File | Status |
|------|--------|
| `frontend/src/pages/LoginPage.jsx` | ✅ Exists |
| `frontend/src/api/client.js` | ✅ Exists |
| `frontend/src/api/authApi.js` | ✅ Exists |
| `frontend/src/contexts/AuthContext.jsx` | ✅ Exists — needs lint fix |
| `frontend/src/hooks/useAuth.js` | ✅ Exists |
| `frontend/src/App.jsx` | ✅ AuthProvider + login route + inline ProtectedRoute |

---

### Files to Modify

| File | Changes Required |
|------|------------------|
| `backend/src/utils/errors.js` | Export `ForbiddenError` (alias to `AuthorizationError`) or update imports to use `AuthorizationError` / `AccountLockedError` |
| `backend/src/services/authService.js` | Use correct error classes for lockout (423) |
| `backend/src/middleware/authorize.js` | Fix error class import |
| `backend/src/validators/authValidators.js` | Align login password min to 8 (per spec) |
| `frontend/src/contexts/AuthContext.jsx` | Split exports; fix setState-in-effect lint |
| `.nvmrc` | Create with `20` |
| `frontend/src/utils/formatters.js` | Add `formatINR` export |

---

### Dependencies

- 🔶 **Task 04:** In Progress — close lint + `formatINR` as part of this work
- 🔶 **Task 10:** In Progress — auth API coded; needs DB + bug fix to verify
- 🔴 **PostgreSQL:** Must be running (`docker compose up -d`)

---

### Acceptance Criteria

- [ ] `ForbiddenError` / lockout paths work without runtime crash
- [ ] `npm run lint` passes in both `backend/` and `frontend/`
- [ ] Login page renders with no console errors
- [ ] Successful login redirects to `/dashboard`
- [ ] Failed login shows "Invalid username or password"
- [ ] Loading spinner on button during API call
- [ ] Token refresh on 401 via axios interceptor
- [ ] Page refresh preserves session (refresh token in localStorage)
- [ ] Admin login works after `npm run migrate` + `npm run seed`

---

### Definition of Done

- All Task 13 acceptance criteria verified with live database
- Critical auth bugs fixed
- Frontend and backend lint clean
- Task 13 marked complete in `PROJECT_STATUS.md`

---

### After Completion

1. Mark Task 13 as ✅ in `PROJECT_STATUS.md`
2. Update this file to **Task 14: Build App Layout (Frontend)**
3. Add entry to `CHANGELOG.md`

---

## Upcoming Tasks (Preview)

| Order | Task # | Title | Depends On |
|-------|--------|-------|------------|
| **NOW →** | **13** | **Finish Login Page (verify + fix)** | DB, bug fixes |
| NEXT | 14 | Build App Layout (Frontend) | Task 13 |
| 3rd | 15 | Build Customer Backend | Task 11, Task 12 |
| 4th | 16 | Build Category Backend | Task 11, Task 12 |
