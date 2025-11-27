# 🔧 Enrollment Troubleshooting Guide

## ✅ What's New

### 1. **Enhanced Enrollment Component**
- ✅ Extensive console logging (check F12)
- ✅ Better error messages
- ✅ Model loading indicator
- ✅ Face capture confirmation
- ✅ Detailed validation

### 2. **Session-Based Attentiveness**
- ✅ Records every 30 seconds
- ✅ Tracks student performance over time
- ✅ Calculates average attentiveness per session

### 3. **Enhanced CSV Export**
- ✅ 30-second interval data with student details
- ✅ Overall summary at the end
- ✅ Student name, USN, emotion, attentiveness score

### 4. **UI Improvements**
- ✅ Removed box shadow from theme button
- ✅ Better status indicators
- ✅ Record counter in export button

---

## 🐛 Debugging Enrollment Issues

### Step 1: Open Browser Console

1. Press **F12** (or right-click → Inspect)
2. Go to **Console** tab
3. Keep it open while enrolling

### Step 2: Try to Enroll

1. Click "Enroll Student"
2. Fill in all fields
3. Click "Start Camera"
4. Click "Capture Face"
5. Click "Enroll Student"

### Step 3: Check Console Logs

You should see these logs in order:

```
✅ Loading face-api models...
✅ Face-api models loaded successfully
✅ Requesting camera access...
✅ Camera started successfully
✅ Attempting to detect face...
✅ Face detected! Descriptor length: 128
✅ === ENROLLMENT ATTEMPT ===
✅ Student data: { name: ..., usn: ..., email: ..., descriptorLength: 128 }
✅ === ENROLLMENT SUCCESS ===
✅ Inserted data: [...]
```

---

## ❌ Common Errors & Solutions

### Error 1: "Permission denied. Please ensure you are logged in as Admin"

**Console shows:**
```
=== SUPABASE ERROR ===
Error code: 42501
Error message: new row violates row-level security policy
```

**Cause:** You're not logged in as Admin, or RLS policies aren't set up

**Solutions:**

1. **Check your user role:**
   ```javascript
   // In browser console, run:
   const { data: { user } } = await supabase.auth.getUser();
   console.log('User role:', user.user_metadata.role);
   ```
   Should show: `User role: admin`

2. **If role is not 'admin':**
   - Sign out
   - Sign up again with role = "Admin"
   - Or update in Supabase Dashboard → Authentication → Users → Edit user metadata

3. **Check RLS policies:**
   - Go to Supabase → Database → Tables → students → Policies
   - Should see: "Allow admin insert on students"
   - If missing, run `supabase-schema.sql` again

---

### Error 2: "A student with this USN already exists"

**Console shows:**
```
=== SUPABASE ERROR ===
Error code: 23505
Error message: duplicate key value violates unique constraint "students_usn_key"
```

**Cause:** USN is already in database

**Solutions:**

1. **Use a different USN**
2. **Or delete the existing student:**
   - Go to Supabase → Database → Tables → students
   - Find the row with that USN
   - Delete it
   - Try again

---

### Error 3: "Failed to load AI models"

**Console shows:**
```
Failed to load face-api models: [error]
```

**Cause:** Network issue or CDN blocked

**Solutions:**

1. **Check internet connection**
2. **Try refreshing the page**
3. **Check if CDN is accessible:**
   - Open: https://justadudewhohacks.github.io/face-api.js/models/
   - Should see list of model files
4. **Check browser console for CORS errors**

---

### Error 4: "No face detected"

**Console shows:**
```
No face detected in frame
```

**Cause:** Face not visible or poor lighting

**Solutions:**

1. **Ensure good lighting**
2. **Face the camera directly**
3. **Remove glasses/hat if blocking face**
4. **Move closer to camera**
5. **Wait for models to fully load** (check for loading indicator)

---

### Error 5: "Camera access denied"

**Console shows:**
```
Camera error: NotAllowedError: Permission denied
```

**Cause:** Browser blocked camera access

**Solutions:**

1. **Chrome:**
   - Click the camera icon in address bar
   - Select "Always allow"
   - Refresh page

2. **Firefox:**
   - Click the camera icon in address bar
   - Select "Allow"
   - Refresh page

3. **Safari:**
   - Safari → Preferences → Websites → Camera
   - Allow for localhost

---

## 📊 CSV Export Format

### Interval Data (Every 30 seconds):

```csv
Timestamp,Time Elapsed,Student Name,USN,Emotion,Attentiveness Score
"11/26/2025, 11:30:00 PM",30s,"John Doe",1XX21CS001,happy,85
"11/26/2025, 11:30:30 PM",60s,"John Doe",1XX21CS001,neutral,72
"11/26/2025, 11:31:00 PM",90s,"John Doe",1XX21CS001,surprised,78
```

### Overall Summary (At the end):

```csv
--- OVERALL SUMMARY ---
Student Name,USN,Avg Attentiveness,Dominant Emotion,Total Records
"John Doe",1XX21CS001,78,happy,10
"Jane Smith",1XX21CS002,65,neutral,10
```

---

## 🎯 Session-Based Attentiveness

### How It Works:

1. **Start Monitoring** → Session begins
2. **Every 30 seconds** → Records:
   - Student name (from enrolled students)
   - USN
   - Current emotion
   - Current attentiveness score
3. **Stop Monitoring** → Session ends
4. **Export** → Get full report with:
   - All 30-second intervals
   - Overall summary per student

### Attentiveness Calculation:

**Per 30-second interval:**
- Happy (>50%) = +90 points
- Surprised (>40%) = +80 points
- Neutral (>60%) = +70 points
- Sad (>40%) = -50 points
- Angry (>40%) = -60 points
- Sleepy = 10 points

**Overall (in summary):**
- Average of all intervals for that student

---

## ✅ Verification Checklist

Before enrolling, verify:

- [ ] Browser console is open (F12)
- [ ] You're logged in as **Admin**
- [ ] Database tables exist (run `supabase-schema.sql`)
- [ ] RLS policies are set up
- [ ] Camera permissions granted
- [ ] Good lighting for face capture
- [ ] Internet connection (for AI models)

---

## 🔍 Manual Database Check

Run this in Supabase SQL Editor to check if enrollment worked:

```sql
-- Check if student was inserted
SELECT * FROM students 
WHERE usn = 'YOUR_USN_HERE';

-- Check total students
SELECT COUNT(*) as total_students FROM students;

-- Check face descriptors
SELECT 
  name, 
  usn, 
  array_length(face_descriptor, 1) as descriptor_length 
FROM students;
```

**Expected:**
- Should see your student
- descriptor_length should be 128

---

## 🆘 Still Not Working?

1. **Copy all console logs** (F12 → Console → Right-click → Save as)
2. **Check Supabase logs:**
   - Go to Supabase → Logs → Postgres Logs
   - Look for errors around the time you tried to enroll
3. **Verify user metadata:**
   ```javascript
   // In browser console:
   const { data: { user } } = await supabase.auth.getUser();
   console.log('Full user object:', user);
   ```
4. **Test database connection:**
   ```javascript
   // In browser console:
   const { data, error } = await supabase.from('students').select('count');
   console.log('Database test:', { data, error });
   ```

---

## 📝 Quick Test Script

Run this in browser console to test everything:

```javascript
// Test 1: Check authentication
const { data: { user } } = await supabase.auth.getUser();
console.log('✅ User:', user?.email, 'Role:', user?.user_metadata?.role);

// Test 2: Check database access
const { data, error } = await supabase.from('students').select('count');
console.log('✅ Database access:', error ? '❌ Failed' : '✅ OK');

// Test 3: Check RLS
const { data: insertTest, error: insertError } = await supabase
  .from('students')
  .insert([{ 
    name: 'TEST', 
    usn: 'TEST123', 
    email: 'test@test.com',
    face_descriptor: new Array(128).fill(0)
  }])
  .select();
console.log('✅ Insert test:', insertError ? `❌ ${insertError.message}` : '✅ OK');

// Clean up test
if (!insertError) {
  await supabase.from('students').delete().eq('usn', 'TEST123');
  console.log('✅ Test cleanup done');
}
```

---

Good luck! The enrollment should work now with all the debugging in place! 🚀
