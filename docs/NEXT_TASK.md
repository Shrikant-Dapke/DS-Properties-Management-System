# DS Properties — Next Task

**Last Updated:** 2026-06-20  
**Source of Truth:** This file defines exactly what should be done next. Update after each task completion.

---

## Current Task

### Task 13: Build Login Page (Frontend) & Resolve Task 04 Lint Issue

**Phase:** 1 — Database & Authentication  
**Complexity:** Medium  
**Reference:** [AI_EXECUTION_PACK.md → Task 13](file:///C:/Users/dapke/Desktop/DS%20Project/DS-Properties-Management-System/docs/AI_EXECUTION_PACK.md)

---

### Objective

1. **Resolve Task 04 Lint Issue:** Refactor `ToastContext.jsx` to clear the React Refresh warning (split the hook/context default export from the provider component export, or configure ESLint rules) to satisfy the "No console errors or warnings" criterion for Task 04.
2. **Build Login Page UI:** Create the login page UI with form validation, error handling, and redirect. Build out the frontend authentication context (`AuthContext.jsx`), custom auth hooks (`useAuth.js`), and the HTTP API clients (`client.js`, `authApi.js`).

---

### Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/pages/LoginPage.jsx` | Login screen view with form inputs and styling |
| `frontend/src/api/client.js` | Axios client instance with request/response interceptors (auth header injection & 401 auto-refresh handler) |
| `frontend/src/api/authApi.js` | Auth endpoint callers (login, refresh, logout, change-password) |
| `frontend/src/contexts/AuthContext.jsx` | React context providing auth states (`user`, `token`, `isAuthenticated`) and utility methods (`login`, `logout`) |
| `frontend/src/hooks/useAuth.js` | Custom hook wrapper for Toast and Authentication Contexts |

---

### Files to Modify

| File | Changes Required |
|------|------------------|
| `frontend/src/contexts/ToastContext.jsx` | Split exports to resolve React Fast Refresh warning |
| `frontend/src/App.jsx` | Wrap the main router/views with `AuthProvider` and mount `/login` route |
| `frontend/src/main.jsx` | Wrap the root rendering with `BrowserRouter` (if not done) |

---

### Dependencies

- 🔶 **Task 04 (Design System):** In Progress (Coded, but requires split context/hook export refactoring to pass ESLint).
- 🔶 **Task 10 (Auth API):** In Progress (Coded, but database connection and integration test coverage are blocked by database server availability).

---

### Acceptance Criteria

- [ ] ESLint check on frontend runs with zero errors or warnings (`npm run lint` passes)
- [ ] Login page renders with no console errors
- [ ] Successful login redirects to `/dashboard`
- [ ] Failed login shows user-friendly error message ("Invalid username or password")
- [ ] Loading spinner animation displays on button during API call
- [ ] Token refresh happens automatically on 401 (interceptor intercepts 401, invokes refresh, retries original call)
- [ ] Page refresh preserves session (auto-restores access token using refresh token in localStorage)

---

### Definition of Done

- Fast refresh lint issues in the frontend are fully resolved
- Admin login is fully testable and works (assuming database connectivity is available)
- Page refresh maintains the logged-in user state
- Bad credentials display correct error toasts or inline validation messages
- ESLint checks pass cleanly on all modified and newly created files

---

### After Completion

1. Mark Task 13 as ✅ in `PROJECT_STATUS.md`
2. Update this file (`NEXT_TASK.md`) to **Task 14: Build App Layout (Frontend)**
3. Add entry to `CHANGELOG.md`

---

## Upcoming Tasks (Preview)

| Order | Task # | Title | Depends On |
|-------|--------|-------|------------|
| **NEXT →** | **13** | **Build Login Page (Frontend)** | 🔶 Task 04, 🔶 Task 10 |
| 2nd | 14 | Build App Layout (Frontend) | Task 13 |
| 3rd | 15 | Build Customer Backend | Task 11, Task 12 |
| 4th | 16 | Build Category Backend | Task 11, Task 12 |
