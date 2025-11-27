# 🔧 Fix Login Redirect Issue

The error you are seeing (`Safari can't connect to localhost:3000`) happens because Supabase is trying to redirect you to `localhost:3000` after login, but:
1.  Your local app is running on port **5173** (Vite default), not 3000.
2.  Or, you are using the deployed Vercel app, so it should redirect to your **Vercel URL**.

## 🚀 How to Fix in Supabase Dashboard

1.  **Go to Supabase**: Log in to [supabase.com](https://supabase.com) and open your project.
2.  **Navigate to Auth Settings**:
    - Click on the **Authentication** icon in the left sidebar.
    - Click on **URL Configuration** (under Configuration).
3.  **Update Site URL**:
    - Set **Site URL** to your Vercel deployment URL (e.g., `https://your-project-name.vercel.app`).
    - *If you don't have the Vercel URL yet, you can temporarily set it to `http://localhost:5173`.*
4.  **Add Redirect URLs**:
    - Add `http://localhost:5173/**` (for local testing).
    - Add `https://your-project-name.vercel.app/**` (for production).
5.  **Save**: Click **Save**.

## 🔄 After Saving
Try logging in again. Supabase will now redirect you to the correct URL.
