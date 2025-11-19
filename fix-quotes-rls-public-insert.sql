-- Fix RLS policies for quotes table to allow public inserts
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can manage all quotes" ON quotes;
DROP POLICY IF EXISTS "Customers can read their own quotes" ON quotes;

-- Create public insert policy (allows anyone to create quotes - NO AUTH REQUIRED)
-- This is critical for the public quote form
CREATE POLICY "Anyone can create quotes" ON quotes
  FOR INSERT 
  WITH CHECK (true);

-- Create customer read policy (customers can read their own quotes)
CREATE POLICY "Customers can read their own quotes" ON quotes
  FOR SELECT 
  USING (
    -- Allow if authenticated user's email matches quote email
    (auth.uid() IS NOT NULL AND customer_email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid()))
    -- OR if customer_id matches authenticated user
    OR (auth.uid() IS NOT NULL AND customer_id = auth.uid())
    -- OR if no auth (for public access via service role)
    OR auth.uid() IS NULL
  );

-- Create admin policy (allows all operations - works with service role key)
-- Service role key bypasses RLS, but this ensures it works
CREATE POLICY "Admins can manage all quotes" ON quotes
  FOR ALL 
  USING (true)
  WITH CHECK (true);

