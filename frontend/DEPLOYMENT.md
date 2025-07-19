# Frontend Deployment Configuration

## Critical Environment Variables for Production

Your frontend at `primeedgefinancebank.com` MUST be deployed with these environment variables:

```bash
NEXT_PUBLIC_API_URL=https://internet-banking-production-68f4.up.railway.app/api
NODE_ENV=production
```

## Deployment Steps

### For Vercel:
1. In your Vercel dashboard, go to your project settings
2. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://internet-banking-production-68f4.up.railway.app/api`
   - `NODE_ENV`: `production`
3. Redeploy your application

### For Netlify:
1. In your Netlify dashboard, go to Site settings > Environment variables
2. Add:
   - `NEXT_PUBLIC_API_URL`: `https://internet-banking-production-68f4.up.railway.app/api`
   - `NODE_ENV`: `production`
3. Trigger a new deploy

### Build Command:
```bash
npm run build
```

### Start Command:
```bash
npm start
```

## Important Notes:

1. **Remove API Rewrites**: The `next.config.js` has been updated to remove API rewrites. Your frontend will call Railway directly.

2. **CORS Configuration**: Railway backend is already configured to accept requests from your domain.

3. **Authentication**: Uses HTTP-only cookies with proper cross-origin settings (`SameSite=None; Secure`).

4. **Environment Variables**: The `NEXT_PUBLIC_API_URL` variable is read by the browser, so it must be set during build time.

## Testing:

After deployment, open browser console and verify:
- "API Base URL" logs show the Railway URL
- API requests go directly to `internet-banking-production-68f4.up.railway.app`
- No 404 errors for help pages (they now exist)
- Login works with proper cookie handling

## Current Status:

✅ Railway backend: Working perfectly
✅ CORS configuration: Correct
✅ Authentication: Fixed cookie settings
✅ Frontend routes: Help pages created
❌ Frontend deployment: Needs environment variables