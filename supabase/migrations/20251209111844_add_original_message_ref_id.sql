/*
  # Add original_message_ref_id field

  1. Changes
    - Add `original_message_ref_id` column to `file_receipt` table
      - This stores the actual MessageRefId extracted from the XML
      - Can be NULL if extraction fails
      - Not unique (allows re-uploading same file)
    - The existing `message_ref_id` remains unique (system-generated)
  
  2. Purpose
    - Display the actual MessageRefId from the file in the UI
    - Allow uploading the same file multiple times
    - Track duplicate MessageRefIds via validation errors
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'file_receipt' AND column_name = 'original_message_ref_id'
  ) THEN
    ALTER TABLE file_receipt ADD COLUMN original_message_ref_id TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_file_receipt_original_msg_ref ON file_receipt (original_message_ref_id);