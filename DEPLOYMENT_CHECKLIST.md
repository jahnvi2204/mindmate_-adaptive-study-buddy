# Deployment Checklist & Issues Found

## ✅ Critical Issues to Fix

### 1. **Environment Variables Missing**
The following environment variables MUST be set in Vercel:

**Required:**
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret  
- `APP_SECRET` - JWT signing secret (use a strong random string, NOT "change-me")
- `GEMINI_API_KEY` or `NEXT_PUBLIC_GEMINI_API_KEY` - Google Gemini API key

**Optional but Recommended:**
- `NEXT_PUBLIC_BASE_URL` - Your production domain (e.g., `https://mindmate-adaptive-study-buddy-yqgb.vercel.app`)

**⚠️ Security Issue:** `APP_SECRET` defaults to `"change-me"` in code. This MUST be changed in production!

### 2. **Google OAuth Redirect URI Configuration**
In Google Cloud Console, ensure these redirect URIs are registered:
- `https://mindmate-adaptive-study-buddy-yqgb.vercel.app/api/auth/google/callback`
- Any preview deployment URLs (if using preview deployments)
- `http://localhost:3000/api/auth/google/callback` (for local development)

### 3. **Cookie Security Settings**
Current cookie settings use `sameSite: "none"` for OAuth state cookies, which requires `secure: true` in production. This is correctly handled via `isProd` check, but ensure:
- Production builds have `NODE_ENV=production` set
- HTTPS is enforced (Vercel does this automatically)

### 4. **Client Component Directives**
✅ All components using browser APIs (`localStorage`, `window`, etc.) correctly have `'use client'` directive:
- `App.tsx` - Uses localStorage ✅
- `components/MaterialsView.tsx` - Has `'use client'` ✅
- `components/Layout.tsx` - Uses fetch, window ✅
- Other components are server-safe ✅

### 5. **API Route Error Handling**
All API routes have basic error handling, but consider:
- Adding rate limiting for production
- More detailed error logging (without exposing secrets)
- Retry logic for external API calls (Gemini, Google OAuth)

### 6. **PDF.js Worker Configuration**
✅ Fixed - Now uses CDN worker URL which avoids bundling issues

### 7. **Build Configuration**
✅ `next.config.js` is properly configured
✅ No static export enabled (correct for API routes)
✅ Webpack config for PDF worker is correct

## ⚠️ Potential Runtime Issues

### 1. **Missing Error Boundaries**
Consider adding React Error Boundaries to catch component errors gracefully:
- Wrap main app sections in error boundaries
- Show user-friendly error messages instead of white screen

### 2. **localStorage Access**
`App.tsx` accesses `localStorage` without try-catch. If localStorage is disabled/blocked, the app will crash. Consider:
```typescript
try {
  const savedMats = localStorage.getItem('mindmate_materials');
  // ... rest of code
} catch (e) {
  console.warn('localStorage not available');
}
```

### 3. **API Error Handling**
Some API calls don't show user-friendly error messages:
- `/api/me` - Silently fails if token invalid
- Gemini service errors - Generic error messages

### 4. **Missing Input Validation**
- OAuth callback doesn't validate token expiration
- JWT verification doesn't check token age
- No rate limiting on API routes

## ✅ What's Working Well

1. ✅ No hardcoded localhost URLs (all use dynamic baseUrl)
2. ✅ Proper client/server component separation
3. ✅ Environment variable fallbacks with sensible defaults
4. ✅ TypeScript types are properly defined
5. ✅ No obvious memory leaks or performance issues
6. ✅ API routes use proper HTTP methods and status codes

## 📋 Pre-Deployment Checklist

- [ ] Set all required environment variables in Vercel
- [ ] Change `APP_SECRET` from default value
- [ ] Register OAuth redirect URIs in Google Cloud Console
- [ ] Test OAuth flow end-to-end
- [ ] Verify PDF upload/parsing works
- [ ] Test all API endpoints
- [ ] Check browser console for errors
- [ ] Verify cookies are set correctly (check DevTools)
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enforced

## 🔍 Post-Deployment Monitoring

Watch for:
- 401 errors on `/api/me` (cookie issues)
- 400 errors on `/api/auth/google/callback` (OAuth state mismatch)
- 500 errors on Gemini API calls (API key issues)
- PDF parsing failures (CDN worker loading)

