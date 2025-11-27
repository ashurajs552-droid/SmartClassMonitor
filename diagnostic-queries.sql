-- Supabase Diagnostic Queries
-- Run these in Supabase SQL Editor to check your setup

-- 1. Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('students', 'attendance')
ORDER BY table_name;

-- 2. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'attendance');

-- 3. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Count existing students
SELECT COUNT(*) as total_students FROM students;

-- 5. Count attendance records
SELECT COUNT(*) as total_attendance_records FROM attendance;

-- 6. Check auth users
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- 7. List all users with their metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'name' as name,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 8. Check table columns
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('students', 'attendance')
ORDER BY table_name, ordinal_position;

-- 9. Test RLS policies (run as authenticated user)
-- This will show if you can read from tables
SELECT 'students' as table_name, COUNT(*) as accessible_rows FROM students
UNION ALL
SELECT 'attendance' as table_name, COUNT(*) as accessible_rows FROM attendance;

-- 10. Check indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('students', 'attendance')
ORDER BY tablename, indexname;
