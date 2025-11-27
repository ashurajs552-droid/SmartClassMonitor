# 🔥 FRESH DATABASE SETUP - Step by Step

## ⚠️ WARNING: This will delete all existing data!

Follow these steps **IN ORDER**:

---

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/aivddofhdsdwkfdaeqms/sql/new
2. You should see the SQL Editor

---

## Step 2: Run the Fresh Schema

1. **Open the file**: `supabase-schema.sql` (in your project folder)
2. **Copy ALL the content** (Ctrl+A, Ctrl+C)
3. **Paste into Supabase SQL Editor**
4. **Click "Run"** (or press Ctrl+Enter)
5. **Wait for success message** - you should see:
   ```
   ✅ SmartClass Monitor database schema created successfully!
   📊 Tables created: students, attendance
   🔒 RLS enabled with policies
   ```

---

## Step 3: Verify Tables Were Created

Run this query in SQL Editor:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('students', 'attendance');
```

**Expected result**: You should see 2 rows:
- students
- attendance

---

## Step 4: Disable Email Confirmation (CRITICAL!)

1. Go to: **Authentication** → **Settings**
2. Scroll to **"Email Auth"** section
3. Find **"Enable email confirmations"**
4. **TURN IT OFF** (toggle should be gray/disabled)
5. Click **"Save"**

**Why?** Without this, you can't login until you confirm your email!

---

## Step 5: Configure Redirect URLs

1. Go to: **Authentication** → **URL Configuration**
2. Under **"Redirect URLs"**, add these (one per line):
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173
   ```
3. Set **"Site URL"** to:
   ```
   http://localhost:5173
   ```
4. Click **"Save"**

---

## Step 6: Test the Application

1. **Clear browser cache**: Press Ctrl+Shift+Delete, clear everything
2. **Go to**: http://localhost:5173
3. **Click "Sign Up"**
4. **Fill in the form**:
   - Name: `Test Admin`
   - Email: `admin@test.com`
   - Role: `Admin`
   - Password: `test123456`
   - Confirm Password: `test123456`
5. **Click "Sign Up"**
6. **You should be redirected to login page**
7. **Login with**:
   - Email: `admin@test.com`
   - Password: `test123456`
8. **You should see the Admin Dashboard!** 🎉

---

## Step 7: Verify in Supabase

1. Go to: **Authentication** → **Users**
2. You should see your test user: `admin@test.com`
3. Click on the user
4. Check **"User Metadata"** - you should see:
   ```json
   {
     "role": "admin",
     "name": "Test Admin"
   }
   ```

---

## 🐛 Troubleshooting

### Still getting "Invalid login credentials"?

**Check these:**

1. **Email confirmation is OFF**:
   - Go to Auth → Settings
   - "Enable email confirmations" should be DISABLED

2. **User exists in database**:
   - Go to Authentication → Users
   - Your email should be listed

3. **User is confirmed** (if email confirmation was on):
   - In Users list, check if "Confirmed" column shows a checkmark
   - If not, delete the user and sign up again (with email confirmation OFF)

### Error: "User already registered"

**Solution:**
1. Go to **Authentication** → **Users**
2. Find your email
3. Click the **"..."** menu → **"Delete user"**
4. Try signing up again

### Google OAuth not working?

**Check:**
1. Google OAuth is enabled in Supabase (Auth → Providers → Google)
2. Client ID and Secret are filled in
3. In Google Cloud Console, add this to **Authorized redirect URIs**:
   ```
   https://aivddofhdsdwkfdaeqms.supabase.co/auth/v1/callback
   ```

---

## 🎯 Quick Verification Checklist

Before testing, make sure:

- [ ] Ran `supabase-schema.sql` successfully
- [ ] Tables `students` and `attendance` exist
- [ ] Email confirmation is DISABLED
- [ ] Redirect URLs are configured
- [ ] Browser cache is cleared
- [ ] Dev server is running (npm run dev)

---

## 📊 Verify Database Setup

Run this in SQL Editor to see everything is working:

```sql
-- Check tables
SELECT 'Tables' as check_type, COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('students', 'attendance')

UNION ALL

-- Check RLS
SELECT 'RLS Enabled' as check_type, COUNT(*) as count
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'attendance')
AND rowsecurity = true

UNION ALL

-- Check policies
SELECT 'RLS Policies' as check_type, COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public'

UNION ALL

-- Check users
SELECT 'Auth Users' as check_type, COUNT(*) as count
FROM auth.users;
```

**Expected results:**
- Tables: 2
- RLS Enabled: 2
- RLS Policies: 7 (or more)
- Auth Users: (however many you created)

---

## 🚀 You're All Set!

Once you complete all steps and can login successfully:

1. **Enroll a student** (Admin Dashboard → Enroll Student)
2. **Start monitoring** (Admin Dashboard → Start Monitoring)
3. **Test teacher dashboard** (Sign up as teacher)
4. **Test student dashboard** (Sign up as student with USN)

---

## 🆘 Still Having Issues?

1. **Check browser console** (F12 → Console tab)
2. **Check Supabase logs** (Logs → Auth Logs)
3. **Run diagnostic queries** (use `diagnostic-queries.sql`)
4. **Verify .env file** has correct credentials

---

## 📝 Notes

- The schema now includes `DROP` statements, so it's safe to run multiple times
- All existing data will be deleted when you run the schema
- For production, you'll want to enable email confirmation
- Google OAuth is optional - email/password works fine for testing

Good luck! 🎓
