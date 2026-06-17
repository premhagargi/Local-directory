-- Enable row-level security for the leads table
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;

-- Step 1: Allow anyone to insert leads (e.g., form submissions)
CREATE POLICY "Allow anyone to insert leads" ON "public"."leads"
    FOR INSERT
    WITH CHECK (true);

-- Step 2: Allow only the owner to view their leads
CREATE POLICY "Allow owners to view their leads" ON "public"."leads"
    FOR SELECT
    using ((SELECT auth.uid()) = owner_id);

-- Step 3: Allow owners to update the status and note for their leads
CREATE POLICY "Allow owners to update their leads" ON "public"."leads"
    FOR UPDATE
        using ((SELECT auth.uid()) = owner_id)
        with check ((SELECT auth.uid()) = owner_id);

-- Step 4: Allow owners to delete their leads
CREATE POLICY "Allow owners to delete their leads" ON "public"."leads"
    FOR DELETE
        using ((SELECT auth.uid()) = owner_id);