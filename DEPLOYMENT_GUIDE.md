# Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] No TypeScript errors
- [x] All components properly typed
- [x] Authentication system integrated
- [x] Download functionality implemented
- [x] Professional resume template added
- [x] Dropdown navigation implemented

### ✅ Environment Variables
Make sure these are set in Vercel:

#### Backend Environment Variables
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-long-and-random
JWT_EXPIRES_IN=7d
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

#### Frontend Environment Variables
```env
VITE_API_BASE_URL=https://your-backend-domain.vercel.app
```

## Deployment Steps

### 1. Commit and Push Changes
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add authentication, professional resume template, and enhanced download options

- Implement JWT-based authentication with role-based access control
- Add professional resume template with advanced form builder
- Enhance download options with PDF, DOC, and print functionality
- Add dropdown navigation for resume builder options
- Integrate user dashboard with role-specific quick actions
- Add comprehensive error handling and loading states"

# Push to main branch
git push origin main
```

### 2. Deploy Backend to Vercel
```bash
# Navigate to backend directory
cd backend

# Deploy to Vercel
vercel --prod

# Or if first time:
vercel
# Follow prompts and then:
vercel --prod
```

### 3. Deploy Frontend to Vercel
```bash
# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel --prod

# Or if first time:
vercel
# Follow prompts and then:
vercel --prod
```

### 4. Configure Environment Variables in Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add all backend environment variables
5. Repeat for frontend project with frontend variables

### 5. Update CORS Settings
Make sure your backend CORS configuration includes your new frontend domain:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-frontend-domain.vercel.app',
  // Add your actual Vercel domains here
];
```

## Post-Deployment Verification

### Test Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes redirect to login
- [ ] Dashboard shows role-specific content
- [ ] Logout functionality works

### Test Resume Builders
- [ ] Basic resume builder loads and functions
- [ ] Professional resume builder loads and functions
- [ ] Template selection works
- [ ] Form data persists during editing
- [ ] Live preview updates correctly

### Test Download Options
- [ ] PDF generation works (both client and server)
- [ ] DOC generation works
- [ ] Print functionality works
- [ ] Download dropdowns function properly
- [ ] Error handling displays user-friendly messages

### Test Navigation
- [ ] Header dropdown for resume builders works
- [ ] Mobile navigation functions correctly
- [ ] Dashboard quick actions navigate properly
- [ ] Authentication state updates navigation

## Troubleshooting Common Issues

### CORS Errors
If you see CORS errors:
1. Check that your frontend domain is in the backend's allowed origins
2. Verify environment variables are set correctly
3. Ensure both frontend and backend are deployed

### Authentication Issues
If authentication doesn't work:
1. Check JWT_SECRET is set in backend environment
2. Verify Supabase credentials are correct
3. Check that API_BASE_URL points to your backend domain

### Download Issues
If downloads fail:
1. Check browser console for errors
2. Verify required libraries are installed
3. Test with different browsers
4. Check file permissions and CORS headers

### Database Connection Issues
If database operations fail:
1. Verify Supabase credentials
2. Check RLS policies are configured correctly
3. Ensure service role key has proper permissions

## Performance Optimization

### Frontend Optimizations
- [ ] Enable Vercel's automatic optimizations
- [ ] Configure proper caching headers
- [ ] Optimize images and assets
- [ ] Enable compression

### Backend Optimizations
- [ ] Configure proper response caching
- [ ] Optimize database queries
- [ ] Enable compression middleware
- [ ] Set appropriate timeout values

## Security Considerations

### Production Security
- [ ] Use strong JWT secrets (minimum 32 characters)
- [ ] Enable HTTPS only
- [ ] Configure proper CORS origins
- [ ] Set secure cookie flags
- [ ] Enable rate limiting if needed

### Environment Variables
- [ ] Never commit secrets to git
- [ ] Use different secrets for production
- [ ] Rotate secrets regularly
- [ ] Use Vercel's secure environment variable storage

## Monitoring and Maintenance

### Set Up Monitoring
- [ ] Configure Vercel Analytics
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor API response times
- [ ] Track user authentication flows

### Regular Maintenance
- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Review and rotate secrets
- [ ] Backup database regularly

## Quick Deploy Commands

```bash
# Full deployment (run from project root)
cd backend && vercel --prod && cd ../frontend && vercel --prod

# Or using npm scripts (if configured)
npm run deploy:backend
npm run deploy:frontend
```

## Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

Your application is now ready for production deployment with full authentication, professional resume templates, and comprehensive download options!