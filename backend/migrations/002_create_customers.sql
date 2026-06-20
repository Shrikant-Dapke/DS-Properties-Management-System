-- =============================================
-- DS Properties — Migration 002: Create Customers Table
-- =============================================
-- Reference: DATABASE_REVIEW.md — Table 2

CREATE TABLE IF NOT EXISTS customers (
    id              SERIAL PRIMARY KEY,
    public_id       UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name            VARCHAR(150) NOT NULL,
    phone           VARCHAR(15),
    email           VARCHAR(255),
    address         TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone) WHERE deleted_at IS NULL AND phone IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_public_id ON customers(public_id);
