-- =============================================
-- DS Properties — Migration 003: Create Expense Categories Table
-- =============================================
-- Reference: DATABASE_REVIEW.md — Table 3

CREATE TABLE IF NOT EXISTS expense_categories (
    id              SERIAL PRIMARY KEY,
    public_id       UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    color_hex       VARCHAR(7) NOT NULL DEFAULT '#6B7280',
    description     TEXT,
    display_order   INTEGER NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_public_id ON expense_categories(public_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON expense_categories(is_active, display_order);
