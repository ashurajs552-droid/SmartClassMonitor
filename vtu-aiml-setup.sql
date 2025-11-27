-- VTU AIML Course Data & Schema Setup (Expanded)

-- 1. Reset Tables (Clean Slate)
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS notes CASCADE;

-- 2. Create Tables
CREATE TABLE assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'pending', -- pending, submitted, completed
  description TEXT,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER DEFAULT 100,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  subject TEXT,
  teacher TEXT,
  tags TEXT[],
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access assignments" ON assignments FOR ALL USING (true);
CREATE POLICY "Public access grades" ON grades FOR ALL USING (true);
CREATE POLICY "Public access notes" ON notes FOR ALL USING (true);

-- 3. Seed VTU AIML Data (Expanded Subjects)

-- SEMESTER 3 & 4 ASSIGNMENTS
INSERT INTO assignments (title, subject, teacher, due_date, points, status, description) VALUES
-- Artificial Intelligence
('Implement A* Search Algorithm', 'Artificial Intelligence', 'Dr. Sharma', NOW() + INTERVAL '2 days', 50, 'pending', 'Write a Python program to implement A* search for the 8-puzzle problem.'),
('Build Expert System for Medical Diagnosis', 'Artificial Intelligence', 'Dr. Sharma', NOW() + INTERVAL '7 days', 100, 'pending', 'Create a rule-based expert system using forward chaining.'),

-- Machine Learning
('Linear Regression on Housing Data', 'Machine Learning', 'Prof. Anjali', NOW() + INTERVAL '5 days', 100, 'pending', 'Perform EDA and build a linear regression model using Scikit-Learn.'),
('K-Means Clustering Implementation', 'Machine Learning', 'Prof. Anjali', NOW() + INTERVAL '10 days', 75, 'pending', 'Implement K-Means from scratch and compare with sklearn.'),

-- DBMS
('Normalization & ER Diagrams', 'Database Management Systems', 'Prof. Rajesh', NOW() + INTERVAL '1 day', 50, 'pending', 'Convert the given schema into 3NF and draw the ER diagram.'),
('SQL Query Optimization', 'Database Management Systems', 'Prof. Rajesh', NOW() + INTERVAL '8 days', 60, 'pending', 'Write optimized queries for the given database schema.'),

-- Python Programming
('Python Lab Record - Part A', 'Python Programming', 'Dr. Kumar', NOW() - INTERVAL '2 days', 50, 'submitted', 'Complete the first 5 lab programs and submit the record.'),
('Django Web Application', 'Python Programming', 'Dr. Kumar', NOW() + INTERVAL '12 days', 150, 'pending', 'Build a student management system using Django framework.'),

-- Design & Analysis of Algorithms
('Analysis of Quick Sort', 'Design & Analysis of Algorithms', 'Prof. Meera', NOW() - INTERVAL '5 days', 50, 'completed', 'Analyze the time complexity of Quick Sort and implement it.'),
('Dynamic Programming - Knapsack', 'Design & Analysis of Algorithms', 'Prof. Meera', NOW() + INTERVAL '6 days', 75, 'pending', 'Solve 0/1 Knapsack problem using dynamic programming.'),

-- Computer Networks
('Socket Programming in C', 'Computer Networks', 'Dr. Venkat', NOW() + INTERVAL '4 days', 80, 'pending', 'Implement client-server chat application using TCP sockets.'),
('Network Protocol Analysis', 'Computer Networks', 'Dr. Venkat', NOW() + INTERVAL '9 days', 60, 'pending', 'Analyze HTTP, FTP, and SMTP protocols using Wireshark.'),

-- Operating Systems
('Process Scheduling Algorithms', 'Operating Systems', 'Prof. Lakshmi', NOW() + INTERVAL '3 days', 70, 'pending', 'Implement FCFS, SJF, and Round Robin scheduling in C.'),
('Banker''s Algorithm for Deadlock', 'Operating Systems', 'Prof. Lakshmi', NOW() + INTERVAL '11 days', 90, 'pending', 'Implement Banker''s algorithm for deadlock avoidance.'),

-- Data Structures
('Binary Search Tree Operations', 'Data Structures', 'Dr. Priya', NOW() + INTERVAL '2 days', 60, 'pending', 'Implement BST with insert, delete, and traversal operations.'),

-- Web Technologies
('Responsive Portfolio Website', 'Web Technologies', 'Prof. Arun', NOW() + INTERVAL '14 days', 100, 'pending', 'Create a responsive portfolio using HTML, CSS, and JavaScript.');

-- GRADES (Expanded)
INSERT INTO grades (title, subject, score, max_score, feedback) VALUES
-- AI & ML
('Internal Assessment 1', 'Artificial Intelligence', 23, 25, 'Good understanding of search strategies.'),
('Machine Learning Quiz', 'Machine Learning', 18, 20, 'Excellent work on supervised learning concepts.'),
('Neural Networks Lab', 'Machine Learning', 42, 50, 'Good implementation, improve documentation.'),

-- DBMS & Python
('DBMS Lab Test', 'Database Management Systems', 45, 50, 'Queries were optimized and correct.'),
('Python Mid-Term', 'Python Programming', 38, 40, 'Strong grasp of OOP concepts.'),

-- DAA & Networks
('Algorithm Analysis Test', 'Design & Analysis of Algorithms', 28, 30, 'Excellent time complexity analysis.'),
('Networks Assignment 1', 'Computer Networks', 35, 40, 'Good understanding of OSI model.'),

-- OS & DS
('OS Internal Exam', 'Operating Systems', 22, 25, 'Well explained process synchronization.'),
('Data Structures Quiz', 'Data Structures', 19, 20, 'Perfect implementation of linked lists.');

-- NOTES (Expanded)
INSERT INTO notes (title, content, subject, teacher, tags) VALUES
('Supervised vs Unsupervised', 'Supervised learning uses labeled data (e.g., classification, regression). Unsupervised uses unlabeled data (e.g., clustering, dimensionality reduction).', 'Machine Learning', 'Prof. Anjali', ARRAY['ML', 'Basics', 'Theory']),
('Normal Forms', '1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. BCNF: Every determinant is a candidate key.', 'Database Management Systems', 'Prof. Rajesh', ARRAY['DBMS', 'Theory', 'Normalization']),
('A* Algorithm Steps', '1. Initialize open and closed lists. 2. Add start node to open list. 3. Loop: find node with lowest f(n) = g(n) + h(n). 4. If goal, return path. 5. Else, expand node.', 'Artificial Intelligence', 'Dr. Sharma', ARRAY['AI', 'Search', 'Algorithms']),
('Python Decorators', 'Decorators are functions that modify the behavior of other functions. Use @decorator_name syntax. Common examples: @staticmethod, @property, @classmethod.', 'Python Programming', 'Dr. Kumar', ARRAY['Python', 'Advanced', 'Functions']),
('TCP vs UDP', 'TCP: Connection-oriented, reliable, ordered delivery, slower. UDP: Connectionless, unreliable, faster, used for streaming/gaming.', 'Computer Networks', 'Dr. Venkat', ARRAY['Networks', 'Protocols', 'Transport Layer']),
('Deadlock Conditions', 'Four necessary conditions: 1. Mutual Exclusion 2. Hold and Wait 3. No Preemption 4. Circular Wait. All must be present for deadlock.', 'Operating Systems', 'Prof. Lakshmi', ARRAY['OS', 'Deadlock', 'Theory']);
