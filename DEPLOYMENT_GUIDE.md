# 🚀 Deployment Guide (Vercel)

## 1. GitHub Repository
Your code has been successfully pushed to:
**https://github.com/ashurajs552-droid/SmartClassE.git**

## 2. Deploying to Vercel

1.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in.
2.  **Add New Project**: Click **"Add New..."** > **"Project"**.
3.  **Import Repository**: Select `SmartClassE` from your GitHub repositories.
4.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect **Vite**.
    *   **Root Directory**: `./` (default).
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
5.  **Environment Variables** (Crucial!):
    Expand the "Environment Variables" section and add the following keys from your Supabase project:
    *   `VITE_SUPABASE_URL`: Your Supabase Project URL.
    *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon/Public Key.
6.  **Deploy**: Click **"Deploy"**.

## 3. Database Setup (Supabase)
Ensure you have run the SQL scripts in your Supabase SQL Editor to create the necessary tables:
1.  `gradespark-schema.sql` (Core tables)
2.  `vtu-aiml-setup.sql` (VTU data and subjects)

## 4. Troubleshooting
- **404 on Refresh**: I have added a `vercel.json` file to handle client-side routing, so refreshing pages like `/student/dashboard` should work correctly.
- **Blank Page**: Check the browser console for errors. Usually indicates missing Environment Variables.
