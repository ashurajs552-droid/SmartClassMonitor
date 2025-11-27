-- Add GradeSpark features to SmartClass Monitor

-- 1. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'pending', -- pending, submitted, graded
  student_id UUID REFERENCES students(id) ON DELETE CASCADE, -- specific to student for now
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Grades Table
CREATE TABLE IF NOT EXISTS grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER DEFAULT 100,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for immediate usage)
CREATE POLICY "Allow all access to assignments" ON assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to grades" ON grades FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to notes" ON notes FOR ALL TO authenticated USING (true);

-- Insert Sample Data for Demo
INSERT INTO assignments (title, subject, due_date, points, status) VALUES
('Algebra Problem Set', 'Mathematics', NOW() + INTERVAL '2 days', 100, 'pending'),
('Essay on Climate Change', 'Science', NOW() + INTERVAL '5 days', 150, 'pending'),
('Reading Comprehension Quiz', 'English', NOW() + INTERVAL '1 day', 50, 'pending');

INSERT INTO grades (title, subject, score, max_score) VALUES
('History Essay', 'History', 92, 100),
('Physics Lab Report', 'Science', 88, 100),
('Spanish Vocabulary Test', 'Spanish', 95, 100);
