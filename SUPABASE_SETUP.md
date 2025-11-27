# Supabase Configuration Guide

## CRITICAL: Complete These Steps Before Using the App

### Step 1: Run the Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `aivddofhdsdwkfdaeqms`
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy the entire contents of `supabase-schema.sql`
6. Paste it into the SQL editor
7. Click **"Run"** or press `Ctrl/Cmd + Enter`
8. You should see success messages

### Step 2: Configure Authentication Settings

1. In Supabase Dashboard, go to **Authentication** → **Providers**

2. **Email Provider** (Already enabled by default):
   - Make sure "Enable Email provider" is ON
   - For testing, **DISABLE** "Confirm email" (you can enable it later for production)
   - Click "Save"

3. **Google OAuth Provider**:
   - Scroll to "Google" provider
   - Toggle it **ON**
   - You mentioned you already added Google OAuth credentials
   - Make sure these fields are filled:
     - Client ID (from Google Cloud Console)
     - Client Secret (from Google Cloud Console)
   - Click "Save"

### Step 3: Configure URL Settings

1. Go to **Authentication** → **URL Configuration**

2. Add these URLs to **Redirect URLs**:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173
   ```

3. Set **Site URL** to:
   ```
   http://localhost:5173
   ```

4. Click "Save"

### Step 4: Verify Row Level Security (RLS)

The SQL schema already sets up RLS, but verify:

1. Go to **Database** → **Tables**
2. Check that both `students` and `attendance` tables exist
3. Click on each table → **Policies** tab
4. You should see policies like:
   - "Allow authenticated read access"
   - "Allow admin insert"
   - etc.

### Step 5: Test Authentication

1. **Disable Email Confirmation** (Important for testing):
   - Go to **Authentication** → **Settings**
   - Under "Email Auth", find "Enable email confirmations"
   - **Turn it OFF** for testing
   - Click "Save"

2. **Test Sign Up**:
   - Go to http://localhost:5173
   - Click "Sign Up"
   - Create a test account with role "Admin"
   - You should be able to sign up without email confirmation

3. **Test Login**:
   - Try logging in with the account you just created
   - You should be redirected to the appropriate dashboard

### Step 6: Verify Google OAuth (If using)

1. Go to **Authentication** → **Providers** → **Google**
2. Make sure:
   - "Enable Sign in with Google" is ON
   - Client ID and Secret are filled
   - Authorized redirect URIs in Google Cloud Console include:
     ```
     https://aivddofhdsdwkfdaeqms.supabase.co/auth/v1/callback
     ```

### Common Issues & Fixes

#### Issue: "Invalid login credentials"

**Causes:**
1. Email confirmation is enabled (users can't login until they confirm email)
2. User doesn't exist in the database
3. Wrong password

**Fix:**
1. Go to **Authentication** → **Settings**
2. Disable "Enable email confirmations"
3. Try signing up again with a new email
4. Or check **Authentication** → **Users** to see if your user exists

#### Issue: "User already registered"

**Fix:**
1. Go to **Authentication** → **Users**
2. Find your email
3. Delete the user
4. Sign up again

#### Issue: Google OAuth not working

**Fix:**
1. Verify Google Cloud Console settings:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `https://aivddofhdsdwkfdaeqms.supabase.co/auth/v1/callback`
2. Make sure Google OAuth is enabled in Supabase
3. Check that Client ID and Secret are correct

#### Issue: "Access denied" or RLS errors

**Fix:**
1. Make sure you ran the `supabase-schema.sql` file
2. Check that RLS policies are created
3. Verify user has the correct role in metadata

### Verification Checklist

Before using the app, verify:

- [ ] Database schema is created (students & attendance tables exist)
- [ ] RLS is enabled on both tables
- [ ] RLS policies are created
- [ ] Email confirmation is DISABLED for testing
- [ ] Email provider is enabled
- [ ] Google OAuth is configured (if using)
- [ ] Redirect URLs are set correctly
- [ ] You can sign up a new user
- [ ] You can login with that user

### Quick Test Commands

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('students', 'attendance');

-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'attendance');

-- Check policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Count users (should show your test users)
SELECT COUNT(*) FROM auth.users;
```

### Production Checklist (For Later)

When deploying to production:

- [ ] Enable email confirmations
- [ ] Update redirect URLs to production domain
- [ ] Enable password strength requirements
- [ ] Set up email templates
- [ ] Configure rate limiting
- [ ] Review and tighten RLS policies
- [ ] Set up monitoring and alerts

## Need Help?

If you're still getting errors:

1. Check the browser console (F12) for detailed error messages
2. Check Supabase logs: **Logs** → **Auth Logs**
3. Verify your `.env` file has the correct credentials
4. Make sure the dev server restarted after `.env` changes

## Current Configuration

Your project is configured with:
- **Project URL**: https://aivddofhdsdwkfdaeqms.supabase.co
- **Anon Key**: (stored in .env)
- **Database**: PostgreSQL with RLS
- **Auth**: Email + Google OAuth
