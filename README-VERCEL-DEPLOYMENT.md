# YVIE AI - Vercel Deployment Guide

This guide walks you through deploying your YVIE AI platform to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A PostgreSQL database (we recommend [Neon](https://neon.tech) for free hosted PostgreSQL)
3. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set up your database

1. Create a PostgreSQL database on Neon or your preferred provider
2. Note down your database connection string (DATABASE_URL)
3. Run the database migrations:
   ```bash
   npm run db:push
   ```

## Step 2: Deploy to Vercel

1. Connect your repository to Vercel:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your repository

2. Configure environment variables in Vercel:
   - Go to your project settings
   - Add the following environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SESSION_SECRET`: A secure random string for session encryption
     - `NODE_ENV`: set to "production"

3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Deploy:
   - Click "Deploy"
   - Your app will be available at `https://your-project-name.vercel.app`

## Step 3: Configure Authentication (Optional)

If you want to enable Google OAuth:
1. Create a Google OAuth app in the Google Cloud Console
2. Add these environment variables in Vercel:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. Configure redirect URLs in your Google OAuth app to include your Vercel domain

## Features Included

✅ Complete authentication system with email/password
✅ User dashboard with dark theme
✅ App builder with drag-and-drop interface
✅ Marketplace for app discovery
✅ Community features
✅ Comprehensive user settings
✅ Database integration with PostgreSQL
✅ Session management
✅ Responsive design for mobile and desktop

## Folder Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express.js API
├── shared/          # Shared schemas and types
├── api/             # Vercel API routes
├── dist/            # Built assets for deployment
└── vercel.json      # Vercel configuration
```

## Environment Variables Required

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption
- `NODE_ENV`: Set to "production"

## Post-Deployment

After deployment:
1. Test login/registration functionality
2. Verify database connections
3. Test app creation and editing
4. Check that all API endpoints work correctly
5. Verify the user settings page functionality

## Troubleshooting

**Database connection issues:**
- Make sure your DATABASE_URL is correct
- Check that your database is accessible from Vercel
- Verify your database schema is up to date

**Authentication issues:**
- Ensure SESSION_SECRET is set
- Check that your domain is whitelisted in any OAuth providers

**Build failures:**
- Review build logs in Vercel dashboard
- Ensure all dependencies are listed in package.json
- Check TypeScript errors with `npm run check`

## Support

For deployment issues, check:
- Vercel documentation
- Your database provider's documentation
- Check the Vercel function logs for runtime errors