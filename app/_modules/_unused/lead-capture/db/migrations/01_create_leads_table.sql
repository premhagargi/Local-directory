-- Create the leads table in the public schema
CREATE TABLE "public"."leads" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique ID for each lead
    name text NOT NULL, -- Name of the visitor
    email text NOT NULL, -- Email address of the visitor
    message text, -- Optional message from the visitor
    listing_id uuid REFERENCES "public"."listings"(id) ON DELETE CASCADE, -- Listing associated with the lead
    sublisting_id uuid REFERENCES "public"."sublistings"(id) ON DELETE SET NULL, -- Optional sublisting ID (if any)
    owner_id uuid REFERENCES "public"."users"(id) ON DELETE CASCADE, -- The owner ((sub-)listing owner) who receives the lead
    status text CHECK (status IN ('New', 'In Progress', 'Closed')) DEFAULT 'New', -- Lead status
    note text, -- Optional note for the owner
    created_at timestamp with time zone DEFAULT now(), -- Timestamp for when the lead was captured
    updated_at timestamp with time zone DEFAULT now() -- Timestamp for when the lead was last updated
);