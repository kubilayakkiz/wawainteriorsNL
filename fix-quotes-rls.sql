-- Fix RLS policy for quotes table
-- Run this in Supabase SQL Editor

-- Drop existing admin policy for quotes
DROP POLICY IF EXISTS "Admins can manage all quotes" ON quotes;

-- Create a simple policy that allows all operations
-- Service role key bypasses RLS, but this ensures it works
CREATE POLICY "Admins can manage all quotes" ON quotes
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Verify: This should now allow service role key to access quotes table
-- After running this, refresh your admin panel and quotes should load

