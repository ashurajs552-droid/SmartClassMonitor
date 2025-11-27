# 🔧 ROOT CAUSE ANALYSIS & FIX

## Problem Summary
- ✅ Enrollment shows "High-quality face profile created!"
- ❌ "Enrolled Students" count stays at 0
- ❌ Students not recognized during monitoring
- ❌ Export says "No data"

## Root Causes Found

### 1. **RLS Policy Blocking Inserts** (PRIMARY ISSUE)
**File:** `supabase-schema.sql` line 55-60

The database has Row Level Security (RLS) that ONLY allows users with `role = 'admin'` to insert students.

**Your user account likely doesn't have this role**, so:
- The insert appears to succeed in the UI
- But Supabase silently rejects it (error code 42501)
- No data is actually saved

### 2. **FaceMatcher Not Updating**
**File:** `src/pages/admin/AdminDashboard.jsx`

Even if enrollment worked, the FaceMatcher wasn't re-initializing when new students were added.

**Status:** ✅ FIXED in latest code

## SOLUTION - Follow These Steps

### Step 1: Fix RLS Policy (REQUIRED)

**Option A - Quick Fix (Recommended for Testing):**

1. Go to your Supabase Dashboard
2. Click "SQL Editor"
3. Copy and paste the contents of `fix-rls-policy.sql`
4. Click "Run"

**Option B - Set Admin Role:**

1. Supabase Dashboard → Authentication → Users
2. Find your email (ashurajs556@gmail.com)
3. Click "Edit User"
4. Under "User Metadata" (Raw JSON), add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save

### Step 2: Test Enrollment

1. Open browser console (F12)
2. Go to Admin Dashboard → Click "Enroll"
3. Fill in student details
4. Capture face (wait for "High-quality face profile created!")
5. Click "Enroll Student"
6. **Check console for:**
   - "Enroll button clicked" ✓
   - "Submitting enrollment data..." ✓
   - "Enrollment success! Data: [...]" ✓ (if working)
   - "Supabase error details: { code: '42501' }" ✗ (if RLS still blocking)

### Step 3: Verify Data Saved

After successful enrollment:
1. Close the enrollment modal
2. Check "Enrolled Students" count (should be 1+)
3. Go to Supabase Dashboard → Table Editor → students
4. Verify the student row exists

### Step 4: Test Recognition

1. Click "Start" monitoring
2. Show your face to camera
3. Check "Live Attendance" panel - should show your name
4. Check "Live Student Cards" - should show your name (not "Student 1")

## Error Codes Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 42501 | Permission denied (RLS) | Run fix-rls-policy.sql OR set admin role |
| 23505 | Duplicate USN/Email | Student already exists, use different USN |
| 22P02 | Invalid array format | Recapture face, ensure camera works |

## Files Modified

1. ✅ `src/components/EnrollStudent.jsx` - Better error messages
2. ✅ `src/pages/admin/AdminDashboard.jsx` - FaceMatcher auto-update
3. ✅ `fix-rls-policy.sql` - SQL script to fix permissions
4. ✅ `ENROLLMENT_FIX.md` - Detailed documentation

## Next Steps After Fix

Once enrollment works:
1. Enroll yourself (ASHU / 1VI23AI001)
2. Start monitoring
3. Verify your name appears in Live Attendance
4. Wait 30 seconds or click Stop
5. Click "Export Report" - should have data

## Still Not Working?

Open browser console and share:
1. The full error message after clicking "Enroll Student"
2. Screenshot of Supabase → Authentication → Users (your user metadata)
3. Screenshot of Supabase → Table Editor → students table
