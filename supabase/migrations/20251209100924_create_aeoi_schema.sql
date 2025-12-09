/*
  # AEOI Exchange Service Schema - Initial Setup

  1. New Tables
    - `file_receipt` - Stores uploaded XML file metadata and processing status
    - `validation_error` - Stores validation errors for files and records
    - `aeoi_case` - Dossier/case management (one per file)
    - `aeoi_task` - Task management (one per file if errors exist)
    - `aeoi_record` - Individual records extracted from XML files
    - `tin_index` - Normalized TIN index for search
    - `currency_rate` - Exchange rates by year (SEK ↔ EUR)
    - `audit_log` - Audit trail for all operations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access (MVP: open for demo purposes)

  3. Constraints
    - MessageRefId must be globally unique
    - DocRefId must be globally unique (except OECD0)
    - Foreign key relationships enforced
*/

-- File Receipt Table
CREATE TABLE IF NOT EXISTS file_receipt (
  file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'UPLOAD',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  jurisdiction TEXT,
  reporting_period INT,
  doc_type_indicator TEXT,
  original_blob_path TEXT NOT NULL,
  message_ref_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'RECEIVED',
  correlation_id TEXT NOT NULL,
  file_size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_message_ref_id ON file_receipt (message_ref_id);
CREATE INDEX IF NOT EXISTS idx_file_receipt_status ON file_receipt (status);
CREATE INDEX IF NOT EXISTS idx_file_receipt_correlation ON file_receipt (correlation_id);

-- Case Table (one per file) - renamed to aeoi_case to avoid reserved keyword
CREATE TABLE IF NOT EXISTS aeoi_case (
  case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES file_receipt(file_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'OPEN',
  dossier_number TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  jurisdiction TEXT,
  reporting_period INT,
  doc_type_indicator TEXT,
  source TEXT DEFAULT 'UPLOAD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_case_file_id ON aeoi_case (file_id);
CREATE INDEX IF NOT EXISTS idx_case_status ON aeoi_case (status);

-- Task Table (one per file if errors)
CREATE TABLE IF NOT EXISTS aeoi_task (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES aeoi_case(case_id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'VALIDATION_ERROR',
  status TEXT NOT NULL DEFAULT 'OPEN',
  sla_due_at TIMESTAMPTZ,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_case_id ON aeoi_task (case_id);
CREATE INDEX IF NOT EXISTS idx_task_status ON aeoi_task (status);

-- Record Table (individual records from XML)
CREATE TABLE IF NOT EXISTS aeoi_record (
  record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES file_receipt(file_id) ON DELETE CASCADE,
  doc_ref_id TEXT NOT NULL,
  corr_doc_ref_id TEXT,
  jurisdiction TEXT,
  reporting_period INT,
  amount_original NUMERIC(18,2),
  currency_original TEXT,
  amount_sek NUMERIC(18,2),
  amount_eur NUMERIC(18,2),
  enrich_status TEXT DEFAULT 'PENDING',
  status TEXT DEFAULT 'PENDING',
  person_or_org TEXT,
  tin_original TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_doc_ref_id ON aeoi_record (doc_ref_id);
CREATE INDEX IF NOT EXISTS idx_record_file_id ON aeoi_record (file_id);
CREATE INDEX IF NOT EXISTS idx_record_status ON aeoi_record (status);
CREATE INDEX IF NOT EXISTS idx_record_corr_doc_ref ON aeoi_record (corr_doc_ref_id);

-- Validation Error Table
CREATE TABLE IF NOT EXISTS validation_error (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES file_receipt(file_id) ON DELETE CASCADE,
  record_id UUID REFERENCES aeoi_record(record_id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'ERROR',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_validation_error_file ON validation_error (file_id);
CREATE INDEX IF NOT EXISTS idx_validation_error_record ON validation_error (record_id);
CREATE INDEX IF NOT EXISTS idx_validation_error_code ON validation_error (code);

-- TIN Index Table (normalized for search)
CREATE TABLE IF NOT EXISTS tin_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tin_normalized TEXT NOT NULL,
  record_id UUID NOT NULL REFERENCES aeoi_record(record_id) ON DELETE CASCADE,
  person_or_org TEXT,
  jurisdiction TEXT,
  reporting_period INT,
  case_id UUID REFERENCES aeoi_case(case_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tin_normalized ON tin_index (tin_normalized);
CREATE INDEX IF NOT EXISTS idx_tin_record_id ON tin_index (record_id);

-- Currency Rate Table
CREATE TABLE IF NOT EXISTS currency_rate (
  year INT PRIMARY KEY,
  sek_per_eur NUMERIC(10,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert predefined rates for 2021-2023
INSERT INTO currency_rate (year, sek_per_eur) VALUES
  (2021, 11.22),
  (2022, 11.00),
  (2023, 10.55)
ON CONFLICT (year) DO NOTHING;

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id TEXT NOT NULL DEFAULT 'anonymous',
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_correlation ON audit_log (correlation_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log (timestamp);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE file_receipt ENABLE ROW LEVEL SECURITY;
ALTER TABLE aeoi_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE aeoi_task ENABLE ROW LEVEL SECURITY;
ALTER TABLE aeoi_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_error ENABLE ROW LEVEL SECURITY;
ALTER TABLE tin_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_rate ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies (MVP: open access for demo)
CREATE POLICY "Allow all access to file_receipt"
  ON file_receipt FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to aeoi_case"
  ON aeoi_case FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to aeoi_task"
  ON aeoi_task FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to aeoi_record"
  ON aeoi_record FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to validation_error"
  ON validation_error FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to tin_index"
  ON tin_index FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to currency_rate"
  ON currency_rate FOR SELECT
  USING (true);

CREATE POLICY "Allow all access to audit_log"
  ON audit_log FOR ALL
  USING (true)
  WITH CHECK (true);