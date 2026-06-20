-- =============================================
-- DS Properties — Migration 004: Create Transactions Table
-- =============================================
-- Reference: DATABASE_REVIEW.md — Table 4 (Core Table)
-- This is the most important table in the system.

CREATE TABLE IF NOT EXISTS transactions (
    id                      SERIAL PRIMARY KEY,
    public_id               UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    type                    VARCHAR(10) NOT NULL CHECK (type IN ('intake', 'outtake')),
    amount                  NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    transaction_date        DATE NOT NULL,
    customer_id             INTEGER REFERENCES customers(id) ON DELETE RESTRICT,
    category_id             INTEGER REFERENCES expense_categories(id) ON DELETE RESTRICT,
    plot_number             VARCHAR(50),
    payment_mode            VARCHAR(20) NOT NULL CHECK (payment_mode IN ('cash', 'cheque', 'upi', 'bank_transfer')),
    description             TEXT,
    reference_number        VARCHAR(100),
    paid_to                 VARCHAR(150),
    is_reversal             BOOLEAN NOT NULL DEFAULT FALSE,
    original_transaction_id INTEGER REFERENCES transactions(id),
    created_by              INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ,

    -- Business rules enforced at DB level
    CONSTRAINT chk_intake_customer CHECK (
        (type = 'intake' AND customer_id IS NOT NULL) OR type = 'outtake'
    ),
    CONSTRAINT chk_outtake_category CHECK (
        (type = 'outtake' AND category_id IS NOT NULL) OR type = 'intake'
    ),
    CONSTRAINT chk_reversal_reference CHECK (
        (is_reversal = TRUE AND original_transaction_id IS NOT NULL) OR is_reversal = FALSE
    )
);

-- Primary query indexes (partial — exclude soft-deleted records)
CREATE UNIQUE INDEX IF NOT EXISTS idx_txn_public_id ON transactions(public_id);
CREATE INDEX IF NOT EXISTS idx_txn_type_date ON transactions(type, transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_txn_customer_date ON transactions(customer_id, transaction_date) WHERE deleted_at IS NULL AND customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_txn_category_date ON transactions(category_id, transaction_date) WHERE deleted_at IS NULL AND category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_txn_created_at ON transactions(created_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_txn_date ON transactions(transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_txn_created_by ON transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_txn_payment_mode ON transactions(payment_mode) WHERE deleted_at IS NULL;
