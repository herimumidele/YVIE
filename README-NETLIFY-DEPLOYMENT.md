# YVIE AI - Netlify Deployment Guide

This guide walks you through deploying your YVIE AI platform to Netlify, which offers excellent support for full-stack applications with serverless functions.

## Why Netlify?

Netlify provides several advantages for your YVIE AI platform:
- ✅ Excellent support for React applications with serverless functions
- ✅ Automatic SSL certificates and global CDN
- ✅ Built-in form handling and edge functions
- ✅ Generous free tier with 100GB bandwidth
- ✅ Simple deployment from Git repositories
- ✅ Environment variable management
- ✅ Branch-based preview deployments

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://netlify.com))
2. A PostgreSQL database (we recommend [Neon](https://neon.tech) for free hosted PostgreSQL)
3. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set up your database

1. Create a PostgreSQL database on Neon or your preferred provider
2. Note down your database connection string (DATABASE_URL)
3. Run the database migrations locally first:
   ```bash
   npm run db:push
   ```

## Step 2: Deploy to Netlify

### Option A: Deploy from Git (Recommended)

1. **Connect your repository to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider and select your repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Set up environment variables:**
   Go to Site settings → Environment variables and add:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_secure_random_string_here
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Your app will be available at `https://your-site-name.netlify.app`

### Option B: Deploy with Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

## Step 3: Configure Authentication (Optional)

If you want to enable Google OAuth:

1. **Create a Google OAuth app:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Add environment variables in Netlify:**
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Configure redirect URLs:**
   Add your Netlify domain to Google OAuth settings:
   - `https://your-site-name.netlify.app/api/auth/google/callback`

## Features Included

✅ Complete authentication system with email/password + Google OAuth
✅ User dashboard with professional dark theme
✅ App builder with drag-and-drop interface
✅ Marketplace for app discovery
✅ Community features for user interaction
✅ Comprehensive user settings (Profile, Security, Notifications, Privacy, Appearance)
✅ Database integration with PostgreSQL
✅ Session management with secure cookies
✅ Responsive design optimized for mobile and desktop
✅ Serverless functions for scalable backend
✅ Automatic HTTPS and global CDN

## Folder Structure

```
├── client/              # Frontend React application
├── server/              # Backend Express.js logic
├── shared/              # Shared schemas and types
├── netlify/
│   └── functions/       # Netlify serverless functions
├── dist/                # Built frontend assets
├── netlify.toml         # Netlify configuration
└── README-NETLIFY-DEPLOYMENT.md
```

## Environment Variables Required

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (generate a secure random string)
- `NODE_ENV`: Set to "production"
- `GOOGLE_CLIENT_ID`: (Optional) Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: (Optional) Google OAuth client secret

## Post-Deployment Testing

After deployment, test these features:

1. **Authentication:**
   - Register a new account with email/password
   - Login with existing credentials
   - Test Google OAuth (if configured)

2. **Core Features:**
   - Navigate through dashboard
   - Access marketplace and community pages
   - Test app creation workflow
   - Verify user settings functionality

3. **API Endpoints:**
   - Check that all API routes respond correctly
   - Verify database connections work
   - Test user session persistence

## Performance Optimizations

Your YVIE AI platform includes several optimizations for Netlify:

- **Vite build optimization** for fast loading
- **Code splitting** for smaller initial bundles
- **Asset optimization** with automatic compression
- **Serverless functions** for scalable backend processing
- **Global CDN** for fast worldwide access

## Troubleshooting

**Build failures:**
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Verify TypeScript compilation with `npm run check`

**Database connection issues:**
- Verify DATABASE_URL format and accessibility
- Check that your database allows connections from Netlify's IP ranges
- Ensure database schema is up to date

**Function timeout errors:**
- Netlify functions have a 10-second timeout on free plans
- Optimize database queries for faster responses
- Consider upgrading to Pro plan for 26-second timeouts

**Authentication issues:**
- Ensure SESSION_SECRET is set and secure
- Check OAuth redirect URLs match your domain
- Verify cookie settings work with your domain

## Scaling and Monitoring

Netlify provides excellent scaling and monitoring:

- **Analytics:** Built-in analytics for traffic and performance
- **Function logs:** Real-time logs for serverless functions
- **Deploy previews:** Test changes on branch deployments
- **A/B testing:** Built-in split testing capabilities
- **Forms:** Handle contact forms without backend code

## Support

For deployment issues:
- Check [Netlify documentation](https://docs.netlify.com)
- Review function logs in Netlify dashboard
- Test locally with `netlify dev` before deploying
- Check your database provider's connection requirements

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure branch-based deployments
3. Set up monitoring and analytics
4. Consider adding Netlify Forms for user feedback
5. Explore Netlify Edge Functions for advanced features