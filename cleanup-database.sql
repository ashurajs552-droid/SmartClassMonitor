-- CLEANUP SCRIPT - Use this to completely reset the database
-- WARNING: This will DELETE ALL DATA!

-- Drop all views
DROP VIEW IF EXISTS student_attendance_report CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS get_student_attendance_summary(TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all tables (CASCADE will remove all dependent objects)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Verify cleanup
DO $$
BEGIN
  RAISE NOTICE '🧹 Cleanup complete!';
  RAISE NOTICE 'All tables, views, and functions have been dropped.';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Run supabase-schema.sql to recreate everything fresh.';
END $$;
