# Quick Setup Guide for SmartClass Monitor

## Step 1: Database Setup (IMPORTANT - Do this first!)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `aivddofhdsdwkfdaeqms`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `supabase-schema.sql` file
6. Paste it into the SQL editor
7. Click "Run" or press Ctrl/Cmd + Enter
8. You should see a success message

## Step 2: Test the Application

The app is already running at: **http://localhost:5173**

### Test Flow:

1. **Visit Landing Page**
   - Open http://localhost:5173
   - You'll see a beautiful landing page with features

2. **Sign Up as Admin**
   - Click "Sign Up Free"
   - Fill in details:
     - Name: Test Admin
     - Email: admin@test.com
     - Role: Admin
     - Password: test123
   - Click "Sign Up"

3. **Login**
   - After signup, you'll be redirected to login
   - Use the credentials you just created
   - You'll be taken to the Admin Dashboard

4. **Enroll a Student (Admin)**
   - Click "Enroll Student" button
   - Fill in student details:
     - Name: John Doe
     - USN: 1XX21CS001
     - Email: john@test.com
   - Click "Start Camera"
   - Position your face in the camera
   - Click "Capture Face"
   - Click "Enroll Student"

5. **Start Monitoring (Admin)**
   - Click "Start Monitoring"
   - Allow camera access
   - You'll see real-time face detection
   - Emotion analysis will appear
   - Attentiveness score will be calculated

6. **Test Teacher Dashboard**
   - Sign out
   - Sign up as a teacher (teacher@test.com)
   - Login and you'll see the teacher dashboard
   - Search for students
   - Export data

7. **Test Student Dashboard**
   - Sign out
   - Sign up as a student with USN: 1XX21CS001
   - Login and search for your USN
   - View your attendance and stats

## Step 3: Features to Test

### Admin Features:
- ✅ Start/Stop Monitoring
- ✅ Enroll Students with Face Capture
- ✅ Real-time Emotion Detection
- ✅ Attentiveness Scoring
- ✅ Export Reports (CSV)
- ✅ Theme Toggle (Dark/Light)

### Teacher Features:
- ✅ View All Students
- ✅ Search Students (by name, USN, email)
- ✅ Export Student Data
- ✅ Theme Toggle

### Student Features:
- ✅ Search by USN
- ✅ View Personal Attendance
- ✅ View Attentiveness Stats
- ✅ Attendance History
- ✅ Theme Toggle

## Troubleshooting

### Camera not working?
- Make sure you've allowed camera permissions in your browser
- Try using Chrome or Edge (best compatibility)
- Check if another app is using the camera

### Face not detecting?
- Ensure good lighting
- Face the camera directly
- Wait for AI models to load (first time takes ~10 seconds)

### Database errors?
- Make sure you ran the SQL schema in Supabase
- Check that RLS policies are enabled
- Verify your Supabase credentials in `.env`

### Login issues?
- Check Supabase Auth settings
- Make sure email confirmations are disabled for testing
- Try using different email addresses

## Default Test Accounts

You can create these for testing:

**Admin:**
- Email: admin@smartclass.com
- Password: admin123
- Role: Admin

**Teacher:**
- Email: teacher@smartclass.com
- Password: teacher123
- Role: Teacher

**Student:**
- Email: student@smartclass.com
- Password: student123
- Role: Student
- USN: 1XX21CS001

## Next Steps

1. **Customize Branding**: Update colors in `src/index.css`
2. **Add More Features**: Extend the dashboards
3. **Deploy**: Use Vercel, Netlify, or similar
4. **Production**: Update Supabase settings for production

## Important Notes

- The app uses CDN for face-api.js models (requires internet)
- First load takes ~10 seconds to download AI models
- Face recognition works best with 1-5 faces (can handle 50-60 but slower)
- Attendance is automatically marked when enrolled face is detected
- All data is stored in Supabase PostgreSQL database

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Supabase connection
3. Ensure all dependencies are installed
4. Try clearing browser cache

Enjoy your SmartClass Monitor! 🎓
