import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type FileReceipt = {
  file_id: string;
  source: string;
  received_at: string;
  jurisdiction: string | null;
  reporting_period: number | null;
  doc_type_indicator: string | null;
  original_blob_path: string;
  message_ref_id: string;
  original_message_ref_id: string | null;
  status: string;
  correlation_id: string;
  file_size_bytes: number | null;
  xml_content: string | null;
  created_at: string;
  updated_at: string;
};

export type AEOICase = {
  case_id: string;
  file_id: string;
  status: string;
  dossier_number: string | null;
  received_at: string;
  jurisdiction: string | null;
  reporting_period: number | null;
  doc_type_indicator: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};

export type AEOITask = {
  task_id: string;
  case_id: string;
  type: string;
  status: string;
  sla_due_at: string | null;
  comments: string | null;
  created_at: string;
  updated_at: string;
};

export type AEOIRecord = {
  record_id: string;
  file_id: string;
  doc_ref_id: string;
  corr_doc_ref_id: string | null;
  jurisdiction: string | null;
  reporting_period: number | null;
  amount_original: number | null;
  currency_original: string | null;
  amount_sek: number | null;
  amount_eur: number | null;
  enrich_status: string;
  status: string;
  person_or_org: string | null;
  tin_original: string | null;
  created_at: string;
  updated_at: string;
};

export type ValidationError = {
  id: string;
  file_id: string;
  record_id: string | null;
  code: string;
  message: string;
  level: string;
  line_number: number | null;
  column_number: number | null;
  xml_snippet: string | null;
  created_at: string;
};

export type TINIndex = {
  id: string;
  tin_normalized: string;
  record_id: string;
  person_or_org: string | null;
  jurisdiction: string | null;
  reporting_period: number | null;
  case_id: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  correlation_id: string;
  timestamp: string;
  actor_id: string;
  action: string;
  details: Record<string, any> | null;
  created_at: string;
};
