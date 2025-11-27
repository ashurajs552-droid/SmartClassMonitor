# SmartClass Monitor

AI-Powered Classroom Analytics & Attendance Management System

## Features

- 🎯 **Real-time Face Detection**: Detect and analyze 50-60 faces simultaneously
- 😊 **Emotion Analysis**: Track 7 emotions (neutral, happy, sad, angry, fearful, disgusted, surprised)
- 📊 **Attentiveness Scoring**: Calculate engagement based on emotional expressions
- ✅ **Auto Attendance**: Automatic attendance marking via facial recognition
- 👥 **Multi-Role System**: Separate dashboards for Admin, Teacher, and Student
- 🌓 **Theme Toggle**: Switch between dark and light modes
- 📈 **Analytics & Reports**: Export data as CSV files
- 🔐 **Secure Authentication**: Powered by Supabase

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Custom CSS with glassmorphism
- **AI/ML**: face-api.js (TensorFlow.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router DOM

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Supabase Database Setup

Run the following SQL in your Supabase SQL Editor:

\`\`\`sql
-- Create students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  usn TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  face_descriptor FLOAT8[] NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  present BOOLEAN DEFAULT TRUE,
  emotion TEXT,
  attentiveness_score INTEGER
);

-- Create indexes for better performance
CREATE INDEX idx_students_usn ON students(usn);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_timestamp ON attendance(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Students table: Allow authenticated users to read, only admins to write
CREATE POLICY "Allow authenticated read access" ON students
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin insert" ON students
  FOR INSERT TO authenticated WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Attendance table: Allow authenticated users to read their own data
CREATE POLICY "Allow authenticated read access" ON attendance
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin insert" ON attendance
  FOR INSERT TO authenticated WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
\`\`\`

### 3. Environment Variables

The `.env` file is already configured with your Supabase credentials:

\`\`\`
VITE_SUPABASE_URL=https://aivddofhdsdwkfdaeqms.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:5173`

## User Roles

### Admin
- Start/Stop classroom monitoring
- Enroll students with face capture
- View real-time analytics
- Export reports

### Teacher
- View all enrolled students
- Search student directory
- Export student data
- Access attendance records

### Student
- View personal attendance
- Check attentiveness scores
- Track performance over time
- Search by USN

## Usage

1. **Sign Up**: Create an account with your role (Admin/Teacher/Student)
2. **Admin**: Enroll students by capturing their faces
3. **Admin**: Start monitoring to begin real-time analysis
4. **Students**: Search by USN to view attendance data
5. **Teachers**: Browse and search student directory

## Face Recognition Flow

1. Admin enrolls student → Face descriptor saved to database
2. Monitoring starts → Camera detects faces in real-time
3. Face matching → Compares detected faces with enrolled students
4. Auto attendance → Marks present when match found
5. Emotion analysis → Calculates attentiveness score
6. Data storage → Records saved for historical analysis

## Export Features

- **Admin**: Export session reports with timestamps, student count, and attentiveness
- **Teacher**: Export complete student directory
- **Student**: View and track personal attendance history

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari (Limited support for some features)

## Security

- Supabase Row Level Security (RLS) enabled
- Role-based access control
- Secure authentication flow
- Protected API routes

## Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Mobile app support
- Integration with LMS platforms
- Automated report generation

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.
