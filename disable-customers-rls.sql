-- TEMPORARY FIX: Disable RLS for customers table
-- This allows service role key to access the table without policy checks
-- Only do this if the policy fix doesn't work

ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- After this, you should be able to access customers table with service role key
-- Note: This removes RLS protection, so make sure only admin panel uses service role key

