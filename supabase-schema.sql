-- SmartClass Monitor Database Schema - FRESH INSTALL
-- This will DROP existing tables and create fresh ones
-- WARNING: This will delete all existing data!

-- Drop existing objects
DROP VIEW IF EXISTS student_attendance_report CASCADE;
DROP FUNCTION IF EXISTS get_student_attendance_summary(TEXT) CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Create students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  usn TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  face_descriptor FLOAT8[] NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  present BOOLEAN DEFAULT TRUE,
  emotion TEXT,
  attentiveness_score INTEGER,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_usn ON students(usn);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_created_at ON students(created_at);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_timestamp ON attendance(timestamp);
CREATE INDEX idx_attendance_session_id ON attendance(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Students table policies
-- Allow all authenticated users to read students
CREATE POLICY "Allow authenticated read access on students" ON students
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow only admins to insert students
CREATE POLICY "Allow admin insert on students" ON students
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Allow only admins to update students
CREATE POLICY "Allow admin update on students" ON students
  FOR UPDATE 
  TO authenticated 
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Allow only admins to delete students
CREATE POLICY "Allow admin delete on students" ON students
  FOR DELETE 
  TO authenticated 
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Attendance table policies
-- Allow all authenticated users to read attendance
CREATE POLICY "Allow authenticated read access on attendance" ON attendance
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow only admins to insert attendance records
CREATE POLICY "Allow admin insert on attendance" ON attendance
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Allow only admins to update attendance
CREATE POLICY "Allow admin update on attendance" ON attendance
  FOR UPDATE 
  TO authenticated 
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Create a function to get student attendance summary
CREATE OR REPLACE FUNCTION get_student_attendance_summary(student_usn TEXT)
RETURNS TABLE (
  total_classes BIGINT,
  classes_attended BIGINT,
  attendance_percentage NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_classes,
    COUNT(*) FILTER (WHERE present = true) as classes_attended,
    CASE 
      WHEN COUNT(*) > 0 THEN
        ROUND((COUNT(*) FILTER (WHERE present = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END as attendance_percentage
  FROM attendance a
  JOIN students s ON a.student_id = s.id
  WHERE s.usn = student_usn;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_student_attendance_summary(TEXT) TO authenticated;

-- Create a view for easy attendance reporting
CREATE OR REPLACE VIEW student_attendance_report AS
SELECT 
  s.id,
  s.name,
  s.usn,
  s.email,
  s.enrolled_at,
  COUNT(a.id) as total_classes,
  COUNT(a.id) FILTER (WHERE a.present = true) as classes_attended,
  CASE 
    WHEN COUNT(a.id) > 0 THEN
      ROUND((COUNT(a.id) FILTER (WHERE a.present = true)::NUMERIC / COUNT(a.id)::NUMERIC) * 100, 2)
    ELSE 0
  END as attendance_percentage,
  ROUND(AVG(a.attentiveness_score) FILTER (WHERE a.present = true), 2) as avg_attentiveness
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.name, s.usn, s.email, s.enrolled_at;

-- Grant select permission on the view
GRANT SELECT ON student_attendance_report TO authenticated;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional - comment out if not needed)
-- INSERT INTO students (name, usn, email, face_descriptor) VALUES
-- ('Test Student', 'TEST001', 'test@example.com', ARRAY[0.1, 0.2, 0.3, 0.4, 0.5]);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ SmartClass Monitor database schema created successfully!';
  RAISE NOTICE '📊 Tables created: students, attendance';
  RAISE NOTICE '🔒 RLS enabled with policies';
  RAISE NOTICE '📈 View created: student_attendance_report';
  RAISE NOTICE '⚡ Function created: get_student_attendance_summary';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next steps:';
  RAISE NOTICE '1. Disable email confirmation in Auth settings';
  RAISE NOTICE '2. Configure Google OAuth (if using)';
  RAISE NOTICE '3. Add redirect URLs: http://localhost:5173/auth/callback';
  RAISE NOTICE '4. Test signup and login';
END $$;
