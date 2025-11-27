# Enrollment Issue - Root Cause & Fix

## Root Causes Identified

### 1. **RLS Policy Blocking Inserts**
The `students` table has RLS enabled with a policy that ONLY allows users with `role = 'admin'` to insert records.

**Location:** `supabase-schema.sql` lines 55-60

```sql
CREATE POLICY "Allow admin insert on students" ON students
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
```

**Problem:** If your user account doesn't have `role: 'admin'` in the metadata, ALL insert attempts will fail silently (Supabase returns error code 42501).

### 2. **Face Descriptor Array Format**
The schema expects `FLOAT8[]` (PostgreSQL array), but JavaScript sends a plain array.

## Solutions

### Option A: Temporary Fix (Disable RLS for Testing)
Run this in Supabase SQL Editor:

```sql
-- Temporarily allow all authenticated users to insert students
DROP POLICY IF EXISTS "Allow admin insert on students" ON students;

CREATE POLICY "Allow authenticated insert on students" ON students
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
```

### Option B: Proper Fix (Set Admin Role)
1. Go to Supabase Dashboard → Authentication → Users
2. Find your user account
3. Click "Edit User"
4. Under "User Metadata", add:
```json
{
  "role": "admin"
}
```
5. Save

### Option C: Update Schema (Recommended for Production)
Modify the RLS policy to be more flexible:

```sql
-- Allow insert if user is admin OR if they're enrolling themselves
CREATE POLICY "Allow admin or self insert on students" ON students
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() ->> 'email') = email
  );
```

## Verification Steps

1. Open browser console (F12)
2. Click "Enroll Student"
3. Fill form and capture face
4. Click "Enroll Student" button
5. Check console for:
   - "Enroll button clicked"
   - "Submitting enrollment data..."
   - "Enrollment success:" (if working)
   - "Supabase error:" (if failing - check error code)

## Error Codes
- `42501`: Permission denied (RLS policy blocking)
- `23505`: Duplicate USN or Email
- `22P02`: Invalid array format (face_descriptor issue)
