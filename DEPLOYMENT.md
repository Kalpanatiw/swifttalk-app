# Deployment Guide

## Prerequisites
- Cloud hosting (AWS, Heroku, Vercel, etc.)
- MongoDB Atlas or managed database
- Stripe and Clerk production accounts

## Backend Deployment (Node.js)

### Using Heroku
1. Install Heroku CLI
2. Run `heroku login`
3. Create app: `heroku create ticket-booking-api`
4. Set environment variables:
   ```
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set STRIPE_SECRET_KEY=your_stripe_key
   heroku config:set CLERK_SECRET_KEY=your_clerk_key
   ```
5. Deploy: `git push heroku main`

### Production Environment Variables
Set all `.env` variables in your hosting platform

## Frontend Deployment (React)

### Using Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   ```
   VITE_API_URL=your_backend_production_url
   VITE_CLERK_PUBLISHABLE_KEY=your_production_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_production_key
   ```
4. Deploy automatically on push

### Build for Production
```bash
npm run build
npm run preview
```

## MongoDB Production Setup
- Use MongoDB Atlas
- Enable authentication
- Setup IP whitelist
- Enable backups
- Monitor performance

## Security Checklist
- ✓ Use HTTPS only
- ✓ Enable CORS for production domains
- ✓ Update all dependencies
- ✓ Use environment variables for secrets
- ✓ Enable rate limiting
- ✓ Monitor API logs
- ✓ Setup error tracking (Sentry)
- ✓ Regular database backups

## Performance Optimization
- Enable caching for static assets
- Use CDN for frontend
- Implement database indexing
- Monitor API response times
- Setup alerts for failures

## Monitoring & Logging
- Setup logging service
- Monitor error rates
- Track user analytics
- Monitor payment transactions
- Alert on critical errors
