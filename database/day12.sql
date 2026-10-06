-- =========================================================
-- IT HELPDESK - DAY 12 DATABASE HARDENING
-- =========================================================

-- =========================================================
-- 1. TICKET STATUS CONSTRAINT
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_ticket_status'
    ) THEN

        ALTER TABLE tickets
        ADD CONSTRAINT chk_ticket_status
        CHECK (
            status IN (
                'OPEN',
                'IN_PROGRESS',
                'RESOLVED',
                'CLOSED'
            )
        );

    END IF;
END $$;


-- =========================================================
-- 2. TICKET PRIORITY CONSTRAINT
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_ticket_priority'
    ) THEN

        ALTER TABLE tickets
        ADD CONSTRAINT chk_ticket_priority
        CHECK (
            priority IN (
                'LOW',
                'MEDIUM',
                'HIGH'
            )
        );

    END IF;
END $$;


-- =========================================================
-- 3. HISTORY -> EMPLOYEE FOREIGN KEY
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_history_employee'
    ) THEN

        ALTER TABLE ticket_history
        ADD CONSTRAINT fk_history_employee
        FOREIGN KEY (changed_by)
        REFERENCES employees(employee_id);

    END IF;
END $$;


-- =========================================================
-- 4. INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_tickets_status
ON tickets(status);

CREATE INDEX IF NOT EXISTS idx_tickets_priority
ON tickets(priority);

CREATE INDEX IF NOT EXISTS idx_tickets_employee
ON tickets(employee_id);

CREATE INDEX IF NOT EXISTS idx_tickets_asset
ON tickets(asset_id);

CREATE INDEX IF NOT EXISTS idx_tickets_created_at
ON tickets(created_at);

CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket
ON ticket_history(ticket_id);

CREATE INDEX IF NOT EXISTS idx_ticket_history_changed_at
ON ticket_history(changed_at);


-- =========================================================
-- 5. VERIFY CONSTRAINTS
-- =========================================================

SELECT
    conname,
    contype
FROM pg_constraint
WHERE conrelid IN (
    'tickets'::regclass,
    'ticket_history'::regclass
)
ORDER BY conname;


-- =========================================================
-- 6. VERIFY INDEXES
-- =========================================================

SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN (
    'tickets',
    'ticket_history'
)
ORDER BY tablename, indexname;


CREATE EXTENSION IF NOT EXISTS pg_trgm;


CREATE TABLE IF NOT EXISTS ticket_evidence (
    evidence_id SERIAL PRIMARY KEY,

    ticket_id INTEGER NOT NULL,

    original_filename VARCHAR(255) NOT NULL,

    stored_filename VARCHAR(255) NOT NULL,

    mime_type VARCHAR(100) NOT NULL,

    file_size_bytes BIGINT NOT NULL,

    sha256_hash CHAR(64) NOT NULL,

    storage_path TEXT NOT NULL,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    uploaded_by INTEGER,

    CONSTRAINT fk_evidence_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(ticket_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_evidence_employee
        FOREIGN KEY (uploaded_by)
        REFERENCES employees(employee_id)
);


CREATE INDEX IF NOT EXISTS idx_ticket_evidence_ticket
ON ticket_evidence(ticket_id);


CREATE INDEX IF NOT EXISTS idx_ticket_evidence_hash
ON ticket_evidence(sha256_hash);


CREATE INDEX IF NOT EXISTS idx_ticket_title_trgm
ON tickets
USING GIN (title gin_trgm_ops);


CREATE INDEX IF NOT EXISTS idx_ticket_description_trgm
ON tickets
USING GIN (description gin_trgm_ops);