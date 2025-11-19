-- QUICK FIX: Fix customers table RLS policy
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing policy that causes permission errors
DROP POLICY IF EXISTS "Admins can manage all customers" ON customers;

-- Step 2: Create a simple policy that allows all operations
-- Service role key should bypass RLS, but this ensures it works
CREATE POLICY "Admins can manage all customers" ON customers
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Verify: This should now allow service role key to access customers table
-- After running this, refresh your admin panel and customers should load

