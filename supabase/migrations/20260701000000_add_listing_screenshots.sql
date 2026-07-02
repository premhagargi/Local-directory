-- Add extra screenshots gallery field to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS screenshot_urls TEXT[] NOT NULL DEFAULT '{}';
