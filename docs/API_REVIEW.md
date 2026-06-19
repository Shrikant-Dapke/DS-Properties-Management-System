# DS Properties — API Design Review & Production Specification

**Reviewer:** Staff Software Architect  
**API Style:** RESTful JSON  
**Base URL:** `/api/v1`  
**Source Document:** DSP_TRD_Technical_Requirements.pdf

---

## PART 1: Original API Review

### Endpoints Proposed (12):

| # | Method | Endpoint | Verdict |
|---|--------|----------|---------|
| 1 | POST | /api/v1/auth/login | ✅ Keep |
| 2 | GET | /api/v1/transactions | ✅ Keep — needs filter spec |
| 3 | POST | /api/v1/transactions | ✅ Keep — needs validation spec |
| 4 | GET | /api/v1/transactions/:id | ✅ Keep — use UUID |
| 5 | PUT | /api/v1/transactions/:id | ✅ Keep — admin only, use UUID |
| 6 | DELETE | /api/v1/transactions/:id | ✅ Keep — soft delete, admin only |
| 7 | GET | /api/v1/dashboard/summary | ✅ Keep — needs cache strategy |
| 8 | GET | /api/v1/reports/daily | ✅ Keep — needs query params |
| 9 | GET | /api/v1/reports/monthly | ✅ Keep — needs query params |
| 10 | GET | /api/v1/customers | ✅ Keep — needs pagination |
| 11 | GET | /api/v1/customers/:id/ledger | ✅ Keep — use UUID |
| 12 | GET | /api/v1/categories | ✅ Keep |

### Missing Endpoints Identified (16):

| # | Method | Endpoint | Why Missing is a Problem |
|---|--------|----------|--------------------------|
| 1 | POST | /auth/refresh | Refresh tokens mentioned but no endpoint |
| 2 | POST | /auth/logout | Cannot invalidate sessions |
| 3 | PUT | /auth/change-password | Settings screen requires it |
| 4 | GET | /users | Admin user management screen |
| 5 | POST | /users | Admin creates operator accounts |
| 6 | PUT | /users/:id | Admin activates/deactivates users |
| 7 | POST | /customers | Intake form needs to create new customers |
| 8 | GET | /customers/:id | View single customer detail |
| 9 | PUT | /customers/:id | Update customer info |
| 10 | POST | /categories | Admin creates new categories |
| 11 | PUT | /categories/:id | Admin updates categories |
| 12 | GET | /reports/category | Category report missing |
| 13 | GET | /reports/export | Unified export endpoint |
| 14 | GET | /audit-logs | Admin views audit trail |
| 15 | GET | /health | Uptime monitoring |
| 16 | GET | /settings | App settings retrieval |

---

## PART 2: API Design Conventions

### Request/Response Format

All responses follow a consistent envelope:

```json
// Success response
{
    "success": true,
    "data": { ... },
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 156,
        "totalPages": 8
    }
}

// Error response
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "amount",
            "message": "Amount must be a positive number"
        }
    ]
}
```

### Pagination

All list endpoints support:
```
?page=1&limit=20&sortBy=created_at&sortOrder=desc
```

Default: `page=1`, `limit=20`, `sortOrder=desc`  
Maximum: `limit=100`

### Authentication

- All endpoints require `Authorization: Bearer <jwt_token>` header except:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
  - `GET /api/v1/health`
- JWT access token: 8-hour expiry
- Refresh token: 30-day expiry, stored hashed in database

### Role-Based Access

| Role | Create | Read | Update | Delete | User Mgmt | Settings |
|------|--------|------|--------|--------|-----------|----------|
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| operator | ✅ | ✅ | ❌ | ❌ | ❌ | Own password |
| viewer | ❌ | ✅ | ❌ | ❌ | ❌ | Own password |

---

## PART 3: Complete API Specification

### Authentication Endpoints

---

#### `POST /api/v1/auth/login`
**Access:** Public  
**Purpose:** Authenticate user and return tokens

**Request:**
```json
{
    "username": "admin",
    "password": "password123"
}
```

**Validation:**
- `username`: required, string, 3-50 chars
- `password`: required, string, 8-128 chars

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "uuid-here",
            "name": "DS Properties Admin",
            "username": "admin",
            "role": "admin"
        },
        "accessToken": "jwt.token.here",
        "refreshToken": "refresh.token.here",
        "expiresIn": 28800
    }
}
```

**Error Responses:**
- `401` — Invalid credentials
- `423` — Account locked (after 5 failed attempts)
- `429` — Rate limited

**Side Effects:**
- Updates `last_login_at` on user
- Resets `failed_login_attempts` on success
- Increments `failed_login_attempts` on failure
- Creates audit log entry

---

#### `POST /api/v1/auth/refresh`
**Access:** Public (with valid refresh token)  
**Purpose:** Exchange refresh token for new access token

**Request:**
```json
{
    "refreshToken": "refresh.token.here"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "accessToken": "new.jwt.token",
        "expiresIn": 28800
    }
}
```

**Error Responses:**
- `401` — Invalid or expired refresh token
- `401` — Token has been revoked

---

#### `POST /api/v1/auth/logout`
**Access:** Authenticated  
**Purpose:** Revoke current refresh token

**Request:**
```json
{
    "refreshToken": "refresh.token.here"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

#### `PUT /api/v1/auth/change-password`
**Access:** Authenticated (any role — own password only)  
**Purpose:** Change current user's password

**Request:**
```json
{
    "currentPassword": "old_password",
    "newPassword": "new_password_123"
}
```

**Validation:**
- `currentPassword`: required
- `newPassword`: required, min 8 chars, must differ from current

**Success Response (200):**
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

**Side Effects:**
- Revokes all existing refresh tokens for the user
- Creates audit log entry

---

### Transaction Endpoints

---

#### `GET /api/v1/transactions`
**Access:** Authenticated (all roles)  
**Purpose:** List transactions with filtering, pagination, and search

**Query Parameters:**
| Param | Type | Description | Example |
|-------|------|-------------|---------|
| `page` | int | Page number | 1 |
| `limit` | int | Items per page (max 100) | 20 |
| `type` | string | Filter: 'intake' or 'outtake' | intake |
| `category_id` | uuid | Filter by category | uuid |
| `customer_id` | uuid | Filter by customer | uuid |
| `payment_mode` | string | Filter by payment mode | cash |
| `date_from` | date | Start date (inclusive) | 2025-06-01 |
| `date_to` | date | End date (inclusive) | 2025-06-30 |
| `search` | string | Search in customer name, description, paid_to | road |
| `min_amount` | number | Minimum amount filter | 1000 |
| `max_amount` | number | Maximum amount filter | 100000 |
| `sortBy` | string | Sort field | transaction_date |
| `sortOrder` | string | asc or desc | desc |

**Success Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "type": "intake",
            "amount": 150000.00,
            "transactionDate": "2025-06-15",
            "customer": {
                "id": "uuid",
                "name": "Rajesh Kumar"
            },
            "category": null,
            "plotNumber": "A-12",
            "paymentMode": "bank_transfer",
            "description": "Second installment",
            "referenceNumber": "UTR12345",
            "paidTo": null,
            "isReversal": false,
            "createdBy": {
                "id": "uuid",
                "name": "Admin"
            },
            "createdAt": "2025-06-15T10:30:00Z"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 156,
        "totalPages": 8
    }
}
```

---

#### `POST /api/v1/transactions`
**Access:** Authenticated (admin, operator)  
**Purpose:** Create a new transaction

**Request (Intake):**
```json
{
    "type": "intake",
    "amount": 150000.00,
    "transactionDate": "2025-06-15",
    "customerId": "customer-uuid",
    "plotNumber": "A-12",
    "paymentMode": "bank_transfer",
    "description": "Second installment",
    "referenceNumber": "UTR12345"
}
```

**Request (Outtake):**
```json
{
    "type": "outtake",
    "amount": 25000.00,
    "transactionDate": "2025-06-15",
    "categoryId": "category-uuid",
    "paymentMode": "cash",
    "description": "Phase 2 road leveling",
    "paidTo": "ABC Contractors",
    "referenceNumber": "BILL-0042"
}
```

**Validation:**
- `type`: required, must be 'intake' or 'outtake'
- `amount`: required, number, > 0, max 15 digits
- `transactionDate`: required, valid date, not in future
- `customerId`: required if type = 'intake', must exist
- `categoryId`: required if type = 'outtake', must exist
- `paymentMode`: required, must be 'cash', 'cheque', 'upi', or 'bank_transfer'
- `description`: optional, max 500 chars
- `referenceNumber`: optional, max 100 chars
- `plotNumber`: optional, max 50 chars
- `paidTo`: optional, max 150 chars

**Business Rules:**
- If amount > 1,000,000 (10 lakh): response includes `warning: "large_amount"`
- Duplicate detection: if same type + amount + date + (customer/category) exists within last 10 minutes, response includes `warning: "possible_duplicate"`

**Success Response (201):**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "type": "intake",
        "amount": 150000.00,
        "transactionDate": "2025-06-15",
        "warnings": ["large_amount"]
    },
    "message": "Transaction created successfully"
}
```

---

#### `GET /api/v1/transactions/:id`
**Access:** Authenticated (all roles)  
**Purpose:** Get single transaction details

**URL Params:** `:id` — transaction UUID

**Success Response (200):** Full transaction object including customer/category detail

---

#### `PUT /api/v1/transactions/:id`
**Access:** Admin only  
**Purpose:** Update an existing transaction

**Request:** Same fields as POST (all optional — partial update)

**Side Effects:**
- Creates audit log with old and new values
- Validates same business rules as POST

---

#### `DELETE /api/v1/transactions/:id`
**Access:** Admin only  
**Purpose:** Soft-delete a transaction

**Request:**
```json
{
    "password": "admin_password"
}
```

**Validation:**
- Requires admin password re-entry for security (as per PRD)

**Side Effects:**
- Sets `deleted_at = NOW()`
- Creates audit log entry
- Does NOT physically remove the record

---

### Dashboard Endpoints

---

#### `GET /api/v1/dashboard/summary`
**Access:** Authenticated (all roles)  
**Purpose:** Return aggregated financial summary

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `date_from` | date | Optional start date filter |
| `date_to` | date | Optional end date filter |

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "totalIntake": 5250000.00,
        "totalOuttake": 1875000.00,
        "currentBalance": 3375000.00,
        "openingBalance": 0.00,
        "thisMonthIntake": 750000.00,
        "thisMonthOuttake": 225000.00,
        "thisMonthNet": 525000.00,
        "lastMonthNet": 480000.00,
        "monthOverMonthChange": 9.38,
        "categoryBreakdown": [
            {
                "id": "uuid",
                "name": "Road Construction",
                "slug": "road-construction",
                "colorHex": "#EF4444",
                "total": 750000.00,
                "percentage": 40.0
            }
        ],
        "todayTransactions": [
            {
                "id": "uuid",
                "type": "intake",
                "amount": 100000.00,
                "customerName": "Rajesh Kumar",
                "createdAt": "2025-06-15T10:30:00Z"
            }
        ],
        "todayIntake": 200000.00,
        "todayOuttake": 45000.00
    }
}
```

**Caching Strategy:**
- Cache for 5 minutes (in-memory using `node-cache`)
- Invalidate on any transaction CREATE/UPDATE/DELETE

---

### Customer Endpoints

---

#### `GET /api/v1/customers`
**Access:** Authenticated (all roles)  
**Purpose:** List all customers with total payment amounts

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name or phone |
| `page` | int | Page number |
| `limit` | int | Items per page |

**Success Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "name": "Rajesh Kumar",
            "phone": "9876543210",
            "totalPaid": 450000.00,
            "lastPaymentDate": "2025-06-10",
            "transactionCount": 5
        }
    ],
    "meta": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
}
```

---

#### `POST /api/v1/customers`
**Access:** Authenticated (admin, operator)  
**Purpose:** Create new customer

**Request:**
```json
{
    "name": "Rajesh Kumar",
    "phone": "9876543210",
    "email": "rajesh@email.com",
    "address": "123 Main St, Pune"
}
```

**Validation:**
- `name`: required, 2-150 chars
- `phone`: optional, valid phone format
- `email`: optional, valid email format
- `address`: optional, max 500 chars

---

#### `GET /api/v1/customers/:id`
**Access:** Authenticated (all roles)  
**Purpose:** Get single customer detail with summary

---

#### `PUT /api/v1/customers/:id`
**Access:** Admin only  
**Purpose:** Update customer information

---

#### `GET /api/v1/customers/:id/ledger`
**Access:** Authenticated (all roles)  
**Purpose:** Get all transactions for a specific customer

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `date_from` | date | Start date filter |
| `date_to` | date | End date filter |
| `page` | int | Page number |
| `limit` | int | Items per page |

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "customer": {
            "id": "uuid",
            "name": "Rajesh Kumar",
            "phone": "9876543210"
        },
        "summary": {
            "totalPaid": 450000.00,
            "transactionCount": 5,
            "firstPayment": "2025-01-15",
            "lastPayment": "2025-06-10"
        },
        "transactions": [
            {
                "id": "uuid",
                "amount": 100000.00,
                "transactionDate": "2025-06-10",
                "paymentMode": "upi",
                "plotNumber": "A-12",
                "description": "Fifth installment"
            }
        ]
    },
    "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

---

### Category Endpoints

---

#### `GET /api/v1/categories`
**Access:** Authenticated (all roles)  
**Purpose:** List expense categories with total spending

**Success Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "name": "Road Construction",
            "slug": "road-construction",
            "colorHex": "#EF4444",
            "totalSpent": 750000.00,
            "transactionCount": 12,
            "isActive": true
        }
    ]
}
```

---

#### `POST /api/v1/categories`
**Access:** Admin only  
**Purpose:** Create new expense category

---

#### `PUT /api/v1/categories/:id`
**Access:** Admin only  
**Purpose:** Update category (name, color, active status)

---

### Report Endpoints

---

#### `GET /api/v1/reports/daily`
**Access:** Authenticated (all roles)  
**Purpose:** All transactions for a specific date

**Query Parameters:**
- `date` (required): YYYY-MM-DD format

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "date": "2025-06-15",
        "totalIntake": 250000.00,
        "totalOuttake": 85000.00,
        "netFlow": 165000.00,
        "transactionCount": 8,
        "transactions": [ ... ]
    }
}
```

---

#### `GET /api/v1/reports/monthly`
**Access:** Authenticated (all roles)  
**Purpose:** Monthly summary with category breakdown

**Query Parameters:**
- `month` (required): 1-12
- `year` (required): YYYY

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "month": 6,
        "year": 2025,
        "totalIntake": 1500000.00,
        "totalOuttake": 450000.00,
        "netFlow": 1050000.00,
        "categoryBreakdown": [
            {
                "category": "Road Construction",
                "total": 200000.00,
                "count": 5,
                "percentage": 44.4
            }
        ],
        "weeklyTrend": [
            { "week": 1, "intake": 400000, "outtake": 120000 },
            { "week": 2, "intake": 350000, "outtake": 100000 },
            { "week": 3, "intake": 450000, "outtake": 130000 },
            { "week": 4, "intake": 300000, "outtake": 100000 }
        ]
    }
}
```

---

#### `GET /api/v1/reports/category`
**Access:** Authenticated (all roles)  
**Purpose:** All expenses under a selected category

**Query Parameters:**
- `category_id` (required): UUID
- `date_from` (optional): YYYY-MM-DD
- `date_to` (optional): YYYY-MM-DD
- `page`, `limit`: pagination

---

#### `GET /api/v1/reports/export`
**Access:** Authenticated (all roles)  
**Purpose:** Generate downloadable report file

**Query Parameters:**
- `type` (required): 'daily', 'monthly', 'customer_ledger', 'category'
- `format` (required): 'pdf' or 'excel'
- Additional params specific to report type

**Response:** Binary file download with appropriate Content-Type header

---

### User Management Endpoints

---

#### `GET /api/v1/users`
**Access:** Admin only  
**Purpose:** List all users

---

#### `POST /api/v1/users`
**Access:** Admin only  
**Purpose:** Create new user

**Request:**
```json
{
    "name": "Operator One",
    "username": "operator1",
    "password": "initial_password",
    "role": "operator"
}
```

---

#### `PUT /api/v1/users/:id`
**Access:** Admin only  
**Purpose:** Update user (name, role, is_active)

---

#### `PUT /api/v1/users/:id/reset-password`
**Access:** Admin only  
**Purpose:** Reset another user's password

---

### Audit & System Endpoints

---

#### `GET /api/v1/audit-logs`
**Access:** Admin only  
**Purpose:** View audit trail

**Query Parameters:**
- `user_id`, `action`, `table_name`, `date_from`, `date_to`, `page`, `limit`

---

#### `GET /api/v1/health`
**Access:** Public  
**Purpose:** Health check for monitoring

**Success Response (200):**
```json
{
    "status": "healthy",
    "timestamp": "2025-06-15T10:30:00Z",
    "uptime": 86400,
    "database": "connected"
}
```

---

#### `GET /api/v1/settings`
**Access:** Authenticated (admin only for write, all for read)

#### `PUT /api/v1/settings`
**Access:** Admin only  
**Purpose:** Update app settings

---

## PART 4: Error Code Reference

| HTTP Code | Meaning | When Used |
|-----------|---------|-----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation failure |
| 401 | Unauthorized | Missing/invalid/expired token |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource (e.g., username taken) |
| 422 | Unprocessable Entity | Business rule violation |
| 423 | Locked | Account locked |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Unexpected server error |

---

## PART 5: Rate Limiting Tiers

| Tier | Endpoints | Limit |
|------|-----------|-------|
| Auth | /auth/login, /auth/refresh | 10 req/min per IP |
| Write | POST, PUT, DELETE on any resource | 30 req/min per user |
| Read | GET on any resource | 200 req/min per user |
| Global | All endpoints combined | 500 req/min per IP |
