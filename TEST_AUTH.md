# Authentication Troubleshooting

## Current Status
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 3000  
- ✅ JWT_SECRET properly configured
- ✅ CORS configured for localhost:3000
- ✅ Environment variables set correctly

## Issue Analysis
The 401 Unauthorized error suggests:
1. The app is trying to access protected routes without authentication
2. An old/invalid token might be stored in localStorage
3. The token verification endpoint might be failing

## Quick Fixes to Try

### 1. Clear Browser Storage
Open browser dev tools (F12) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Test Backend Endpoints
Open a new browser tab and test:
- http://localhost:5000 (should show API status)
- http://localhost:5000/api/status/health (should show health check)

### 3. Check Network Tab
In browser dev tools:
1. Go to Network tab
2. Try to access the app
3. Look for failed requests and their error details

### 4. Use Auth Debug Component
The app now includes an AuthDebug component in the bottom-right corner that shows:
- Authentication status
- Token presence
- User information
- Button to clear token

## Expected Behavior
1. **First Visit**: Should show home page without authentication
2. **Protected Routes**: Should redirect to login page
3. **After Login**: Should show dashboard and authenticated features

## Test Registration/Login
1. Go to http://localhost:3000
2. Click "Login" button in header
3. Try registering a new account:
   - Name: Test User
   - Email: test@example.com  
   - Password: password123
   - Role: Student

## If Issues Persist
1. Check browser console for detailed error messages
2. Check backend logs for authentication errors
3. Verify Supabase connection is working
4. Test with a fresh browser session (incognito mode)