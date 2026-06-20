-- =============================================
-- DS Properties — Migration 007: Create App Settings Table
-- =============================================
-- Reference: DATABASE_REVIEW.md — Table 7, ADR-009

CREATE TABLE IF NOT EXISTS app_settings (
    id              SERIAL PRIMARY KEY,
    key             VARCHAR(100) NOT NULL UNIQUE,
    value           TEXT NOT NULL,
    description     TEXT,
    updated_by      INTEGER REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
