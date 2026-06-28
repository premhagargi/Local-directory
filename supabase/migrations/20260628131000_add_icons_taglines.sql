-- Add icon field to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon VARCHAR;

-- Add tagline field to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS tagline VARCHAR(120);
