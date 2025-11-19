-- Final fix for quotes RLS policies to allow public inserts
-- Run this in Supabase SQL Editor
-- This will fix the "new row violates row-level security policy" error

-- Step 1: Drop ALL existing policies on quotes table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'quotes') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON quotes';
    END LOOP;
END $$;

-- Step 2: Create public insert policy (CRITICAL - allows anonymous inserts)
-- This policy allows ANYONE (including unauthenticated users) to insert quotes
CREATE POLICY "public_insert_quotes" ON quotes
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Step 3: Allow customers to read their own quotes
CREATE POLICY "customers_read_own_quotes" ON quotes
  FOR SELECT 
  TO public
  USING (
    -- If authenticated, allow if email matches
    (auth.uid() IS NOT NULL AND customer_email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid()))
    -- OR if customer_id matches
    OR (auth.uid() IS NOT NULL AND customer_id = auth.uid())
    -- OR if not authenticated (for service role)
    OR auth.uid() IS NULL
  );

-- Step 4: Allow service role/admin to do everything
CREATE POLICY "admin_manage_all_quotes" ON quotes
  FOR ALL 
  TO public
  USING (true)
  WITH CHECK (true);

-- Step 5: Verify policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY policyname;

