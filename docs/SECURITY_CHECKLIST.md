# DS Properties — Security Checklist

**Reviewer:** Staff Software Architect  
**Last Updated:** June 2025  
**Classification:** Internal — Do not share externally

---

## Overview

This checklist covers all security controls required for the DS Properties Financial Tracking System. Every item must be verified before production deployment.

Status Key:
- 🔲 Not implemented
- 🔶 In progress
- ✅ Implemented and verified

---

## 1. Authentication Security

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 1.1 | Password hashing with bcrypt | Critical | Cost factor 12, use `bcrypt` library | 🔲 |
| 1.2 | Minimum password length | Critical | 8 characters minimum, 128 max | 🔲 |
| 1.3 | JWT access token expiry | Critical | 8 hours maximum, signed with HS256 | 🔲 |
| 1.4 | JWT refresh token expiry | Critical | 30 days, stored hashed in database | 🔲 |
| 1.5 | Refresh token rotation | High | Issue new refresh token on each refresh; revoke old | 🔲 |
| 1.6 | Token revocation on logout | High | Mark refresh token as revoked in DB | 🔲 |
| 1.7 | Revoke all tokens on password change | High | All sessions invalidated when password changes | 🔲 |
| 1.8 | Account lockout | High | Lock for 15 min after 5 consecutive failures | 🔲 |
| 1.9 | Failed login tracking | High | Increment counter in DB, reset on success | 🔲 |
| 1.10 | JWT secret strength | High | Minimum 256-bit random secret, not hardcoded | 🔲 |
| 1.11 | Separate refresh token secret | Medium | Different key from access token | 🔲 |
| 1.12 | No token in URL params | Medium | Tokens only in Authorization header or httpOnly cookie | 🔲 |
| 1.13 | Token payload — no sensitive data | Medium | JWT payload: user_id, role, exp only. No password or PII | 🔲 |

---

## 2. Authorization & Access Control

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 2.1 | Role-based middleware | Critical | Check role on every protected endpoint | 🔲 |
| 2.2 | Admin-only routes enforced | Critical | DELETE, PUT (transactions), user mgmt, audit logs | 🔲 |
| 2.3 | Operator cannot edit/delete | Critical | Operators can only create and read | 🔲 |
| 2.4 | Viewer read-only enforcement | High | Viewers cannot create, update, or delete anything | 🔲 |
| 2.5 | Admin password re-entry for deletes | High | Soft-delete requires admin password confirmation | 🔲 |
| 2.6 | UUID-based resource access | High | All API IDs are UUIDs, not sequential integers | 🔲 |
| 2.7 | No horizontal privilege escalation | High | Users cannot access other users' data (if applicable) | 🔲 |
| 2.8 | Cannot self-promote role | Medium | Operator cannot change own role to admin | 🔲 |
| 2.9 | Cannot deactivate last admin | Medium | System must have at least one active admin user | 🔲 |

---

## 3. Input Validation & Sanitization

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 3.1 | Joi schema validation on all endpoints | Critical | Every POST/PUT body validated before processing | 🔲 |
| 3.2 | Type coercion prevention | High | Strings not auto-coerced to numbers; reject invalid types | 🔲 |
| 3.3 | Amount field validation | High | Positive number, max 15 digits, 2 decimal places | 🔲 |
| 3.4 | Date field validation | High | Valid date format, not in future (for transactions) | 🔲 |
| 3.5 | Enum field validation | High | type, payment_mode, role — only allowed values | 🔲 |
| 3.6 | String length limits | High | All VARCHAR fields validated against DB column lengths | 🔲 |
| 3.7 | HTML/script stripping | High | All text inputs sanitized (xss library or sanitize-html) | 🔲 |
| 3.8 | Query parameter validation | Medium | page/limit must be positive integers, sortBy must be whitelisted | 🔲 |
| 3.9 | UUID format validation | Medium | All :id params validated as UUID v4 format | 🔲 |
| 3.10 | File upload validation | Low | Not in Phase 1, but plan for MIME type + size limits | 🔲 |

---

## 4. SQL Injection Prevention

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 4.1 | Parameterized queries only | Critical | Use `$1, $2` placeholders with `pg` library | 🔲 |
| 4.2 | No string concatenation in SQL | Critical | Never build SQL with template literals or string concat | 🔲 |
| 4.3 | Whitelist-based sort columns | High | sortBy parameter validated against allowed column list | 🔲 |
| 4.4 | No raw SQL from user input | High | Search terms parameterized, not injected | 🔲 |
| 4.5 | ORM/query builder consideration | Medium | If using Knex.js, use parameterized .where() not .whereRaw() | 🔲 |

---

## 5. Cross-Site Scripting (XSS) Prevention

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 5.1 | React auto-escaping | High | Never use `dangerouslySetInnerHTML` | 🔲 |
| 5.2 | Server-side output encoding | High | All API responses properly encoded | 🔲 |
| 5.3 | Content-Security-Policy header | High | Restrict script sources, no inline scripts | 🔲 |
| 5.4 | X-Content-Type-Options: nosniff | Medium | Prevent MIME type sniffing | 🔲 |
| 5.5 | X-Frame-Options: DENY | Medium | Prevent clickjacking | 🔲 |

---

## 6. Cross-Site Request Forgery (CSRF) Prevention

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 6.1 | Bearer token in Authorization header | High | Not in cookies — CSRF not applicable | 🔲 |
| 6.2 | If cookies used: SameSite=Strict | High | Only if token storage strategy changes | 🔲 |
| 6.3 | CORS restricted to frontend domain | High | Only allow requests from the SPA domain | 🔲 |
| 6.4 | Reject requests without Origin header | Medium | Block non-browser automated requests to mutations | 🔲 |

---

## 7. Rate Limiting & DoS Protection

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 7.1 | Auth endpoint rate limit | Critical | 10 requests/min per IP on /auth/login | 🔲 |
| 7.2 | Write endpoint rate limit | High | 30 requests/min per user | 🔲 |
| 7.3 | Read endpoint rate limit | Medium | 200 requests/min per user | 🔲 |
| 7.4 | Global rate limit | Medium | 500 requests/min per IP | 🔲 |
| 7.5 | Rate limit response headers | Medium | Include X-RateLimit-Remaining, X-RateLimit-Reset | 🔲 |
| 7.6 | Request body size limit | Medium | Express body-parser limit: 1MB max | 🔲 |
| 7.7 | Pagination limit enforcement | Medium | Max 100 items per page, reject larger values | 🔲 |

---

## 8. Transport Security

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 8.1 | HTTPS only (Let's Encrypt) | Critical | All traffic over TLS 1.2+ | 🔲 |
| 8.2 | HTTP → HTTPS redirect | Critical | Nginx redirect all port 80 to 443 | 🔲 |
| 8.3 | HSTS header | High | Strict-Transport-Security: max-age=31536000 | 🔲 |
| 8.4 | SSL certificate auto-renewal | High | Certbot cron job for Let's Encrypt | 🔲 |
| 8.5 | Database connection encryption | Medium | PostgreSQL SSL if DB on separate server | 🔲 |
| 8.6 | Secure cookie flags | Medium | httpOnly, secure, SameSite (if cookies used) | 🔲 |

---

## 9. Audit Logging

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 9.1 | Log all CRUD operations | Critical | Create, update, delete on transactions, customers | 🔲 |
| 9.2 | Log authentication events | Critical | Login success/failure, logout, password change | 🔲 |
| 9.3 | Store old and new values | High | JSONB snapshots for update operations | 🔲 |
| 9.4 | Capture IP address | High | Client IP from request (X-Forwarded-For behind Nginx) | 🔲 |
| 9.5 | Capture user agent | Medium | Browser/device info for security forensics | 🔲 |
| 9.6 | Immutable audit log | High | No UPDATE or DELETE on audit_logs table | 🔲 |
| 9.7 | Audit log retention | Medium | Keep indefinitely (financial records) | 🔲 |
| 9.8 | Admin audit log view | Medium | Admin can query and filter audit trail in UI | 🔲 |

---

## 10. Data Protection & Backup

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 10.1 | Automated daily pg_dump | Critical | 2:00 AM IST daily backup | 🔲 |
| 10.2 | Offsite backup storage | Critical | Upload to S3/Backblaze B2 (separate from VPS) | 🔲 |
| 10.3 | 30-day backup retention | High | Auto-delete backups older than 30 days | 🔲 |
| 10.4 | Backup verification | High | Monthly test restore to verify backup integrity | 🔲 |
| 10.5 | Soft delete only | Critical | No physical deletion of financial records | 🔲 |
| 10.6 | No PII in logs | High | Application logs must not contain passwords or tokens | 🔲 |
| 10.7 | Environment variables for secrets | Critical | No secrets in code, config files, or version control | 🔲 |
| 10.8 | .env excluded from git | Critical | .env in .gitignore; .env.example committed | 🔲 |
| 10.9 | Database user least privilege | Medium | App DB user has no DROP, TRUNCATE, or GRANT permissions | 🔲 |
| 10.10 | Disaster recovery procedure | Medium | Documented steps to restore from backup on new server | 🔲 |

---

## 11. HTTP Security Headers

Apply via Nginx or Express middleware (`helmet` package):

| Header | Value | Priority |
|--------|-------|----------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com` | High |
| `X-Content-Type-Options` | `nosniff` | High |
| `X-Frame-Options` | `DENY` | High |
| `X-XSS-Protection` | `0` (disabled — rely on CSP instead) | Medium |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | High |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Medium |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Low |

---

## 12. Dependency Security

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 12.1 | npm audit on install | High | Run `npm audit` as part of CI/CD | 🔲 |
| 12.2 | Lock file committed | High | `package-lock.json` in version control | 🔲 |
| 12.3 | No unnecessary dependencies | Medium | Minimize attack surface — audit package.json | 🔲 |
| 12.4 | Regular dependency updates | Medium | Monthly review of outdated packages | 🔲 |

---

## 13. Server & Deployment Security

| # | Control | Priority | Details | Status |
|---|---------|----------|---------|--------|
| 13.1 | Non-root Node.js process | High | PM2 runs under non-root user | 🔲 |
| 13.2 | Firewall (ufw) | High | Only ports 22, 80, 443 open | 🔲 |
| 13.3 | SSH key authentication | High | Disable password SSH login | 🔲 |
| 13.4 | Fail2ban | Medium | Auto-ban IPs with repeated SSH failures | 🔲 |
| 13.5 | Separate DB user | Medium | Application uses limited DB role, not postgres superuser | 🔲 |
| 13.6 | Environment-specific configs | Medium | NODE_ENV=production disables stack traces in errors | 🔲 |
| 13.7 | PM2 auto-restart | Medium | Restart on crash, max memory limit | 🔲 |

---

## Pre-Deployment Security Sign-Off

Before going live, the following must be verified:

- [ ] All Critical items in this checklist are ✅
- [ ] All High items are ✅ or have documented exceptions
- [ ] `npm audit` shows 0 critical/high vulnerabilities
- [ ] HTTPS is working and auto-renewing
- [ ] Backup cron is running and verified
- [ ] Admin password changed from default
- [ ] JWT secrets are strong random values (not defaults)
- [ ] .env is NOT in version control
- [ ] Error responses in production do NOT expose stack traces
- [ ] Rate limiting is active and tested
