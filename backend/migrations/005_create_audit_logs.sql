-- =============================================
-- DS Properties — Migration 005: Create Audit Logs Table
-- =============================================
-- Reference: DATABASE_REVIEW.md — Table 5

CREATE TABLE IF NOT EXISTS audit_logs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    action          VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'login_failed', 'logout', 'password_change')),
    table_name      VARCHAR(50) NOT NULL,
    record_id       INTEGER,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
