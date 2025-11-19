-- Fix RLS policies for admin operations with service role key
-- Service role key bypasses RLS automatically, but we need to ensure policies don't break

-- Drop existing admin policies and recreate with better conditions
DROP POLICY IF EXISTS "Admins can manage all customers" ON customers;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage all quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;

-- Customers: Allow service role to manage all (service role bypasses RLS automatically)
-- Also allow authenticated admins
CREATE POLICY "Admins can manage all customers" ON customers
  FOR ALL USING (
    -- Service role key bypasses RLS automatically, so this is just for authenticated admins
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
    OR auth.uid() IS NULL  -- Allow service role (when uid is NULL, it means service role)
  );

-- Blog posts: Same approach
CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
    OR auth.uid() IS NULL
  );

-- Projects: Same approach
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
    OR auth.uid() IS NULL
  );

-- Quotes: Same approach
CREATE POLICY "Admins can manage all quotes" ON quotes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
    OR auth.uid() IS NULL
  );

-- Jobs: Same approach
CREATE POLICY "Admins can manage all jobs" ON jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
    OR auth.uid() IS NULL
  );

-- Alternative simpler solution: Disable RLS checks for service role
-- Service role key already bypasses RLS automatically in Supabase
-- But if you still have issues, you can temporarily disable RLS for admin operations:

-- IMPORTANT: The service role key bypasses RLS automatically.
-- If you're still getting errors, check that:
-- 1. NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is set correctly in .env.local
-- 2. You've restarted the dev server after adding the key
-- 3. The key is the "service_role" key, not the "anon" key

