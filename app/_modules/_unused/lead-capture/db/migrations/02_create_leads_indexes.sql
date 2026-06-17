-- Create indexes for faster lookups
CREATE INDEX idx_leads_listing_id ON "public"."leads" (listing_id);
CREATE INDEX idx_leads_sublisting_id ON "public"."leads" (sublisting_id);
CREATE INDEX idx_leads_owner_id ON "public"."leads" (owner_id);