/*
  # Add XML Content Storage and Error Line Numbers

  1. Schema Changes
    - Add `xml_content` column to `file_receipt` table to store uploaded XML files
    - Add `line_number` column to `validation_error` table to track error locations
    - Add `column_number` column to `validation_error` table for precise error positioning
    - Add `xml_snippet` column to `validation_error` table to pre-store context around errors

  2. Purpose
    - Enable displaying XML snippets when users click on validation errors
    - Store line numbers for each validation error for precise error location
    - Pre-store 11 lines of context (5 before, error line, 5 after) for performance

  3. Notes
    - xml_content uses TEXT type to handle large XML files
    - line_number and column_number are optional as not all errors have location info
    - xml_snippet is optional and stores pre-extracted context for quick display
*/

-- Add xml_content column to file_receipt table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'file_receipt' AND column_name = 'xml_content'
  ) THEN
    ALTER TABLE file_receipt ADD COLUMN xml_content TEXT;
  END IF;
END $$;

-- Add line_number column to validation_error table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'validation_error' AND column_name = 'line_number'
  ) THEN
    ALTER TABLE validation_error ADD COLUMN line_number INT;
  END IF;
END $$;

-- Add column_number column to validation_error table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'validation_error' AND column_name = 'column_number'
  ) THEN
    ALTER TABLE validation_error ADD COLUMN column_number INT;
  END IF;
END $$;

-- Add xml_snippet column to validation_error table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'validation_error' AND column_name = 'xml_snippet'
  ) THEN
    ALTER TABLE validation_error ADD COLUMN xml_snippet TEXT;
  END IF;
END $$;

-- Create index on line_number for performance
CREATE INDEX IF NOT EXISTS idx_validation_error_line_number ON validation_error (line_number);