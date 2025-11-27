-- Quick Fix for Enrollment Issues
-- Run this in Supabase SQL Editor

-- Step 1: Drop the restrictive admin-only policy
DROP POLICY IF EXISTS "Allow admin insert on students" ON students;

-- Step 2: Create a more permissive policy for testing
-- This allows ALL authenticated users to insert students
CREATE POLICY "Allow authenticated insert on students" ON students
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Step 3: Verify the policy was created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'students';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policy updated successfully!';
  RAISE NOTICE '📝 All authenticated users can now enroll students';
  RAISE NOTICE '⚠️  For production, restrict this to admin users only';
END $$;
