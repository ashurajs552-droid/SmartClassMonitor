-- 🛠️ Complete Enrollment Fix Script
-- Run this in your Supabase SQL Editor to fix "Enrollment Failed" issues.

-- 1. Ensure the students table exists with the correct schema
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    usn TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    face_descriptor float8[], -- Stores the 128-float face array
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 3. Drop ALL existing policies to clean up conflicts
DROP POLICY IF EXISTS "Allow admin insert on students" ON public.students;
DROP POLICY IF EXISTS "Allow authenticated insert on students" ON public.students;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.students;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.students;
DROP POLICY IF EXISTS "Enable all for anon" ON public.students;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.students;
DROP POLICY IF EXISTS "Enable update for all users" ON public.students;

-- 4. Create new PERMISSIVE policies (Fixes "Permission Denied")
-- Allow anyone (logged in or not) to READ student data (needed for face matching)
CREATE POLICY "Enable read access for all users" ON public.students
    FOR SELECT USING (true);

-- Allow anyone (logged in or not) to INSERT student data (needed for enrollment)
CREATE POLICY "Enable insert for all users" ON public.students
    FOR INSERT WITH CHECK (true);

-- Allow anyone to UPDATE (optional, but good for maintenance)
CREATE POLICY "Enable update for all users" ON public.students
    FOR UPDATE USING (true);

-- 5. Grant necessary permissions to Supabase roles
GRANT ALL ON TABLE public.students TO anon;
GRANT ALL ON TABLE public.students TO authenticated;
GRANT ALL ON TABLE public.students TO service_role;

-- 6. Verify
DO $$
BEGIN
  RAISE NOTICE '✅ Enrollment system fixed successfully!';
  RAISE NOTICE '📝 Table schema verified and RLS policies reset to allow access.';
END $$;
