# Ticket Booking System - Setup Guide

## Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB
- Stripe & Clerk accounts

### Installation

1. Clone the repository
2. Set up backend:
   - Start MongoDB
   - Copy `.env.example` to `.env` in server folder
   - Install dependencies: `npm install`
   - Start server: `npm run dev`

3. Set up frontend:
   - Copy `.env.example` to `.env` in client folder  
   - Install dependencies: `npm install`
   - Start client: `npm run dev`

Access at http://localhost:5173

### Environment Configuration

Backend variables needed:
- MongoDB connection string
- Clerk keys
- Stripe keys
- JWT secret

Frontend variables needed:
- API URL
- Clerk publishable key
- Stripe publishable key

### Key Features Implemented

✓ Movie browsing and search
✓ Real-time seat availability
✓ Secure Stripe payments
✓ Admin dashboard
✓ User bookings management
✓ Revenue analytics
✓ Payment refunds
✓ Rate limiting
✓ Role-based access control

### Database Setup

Ensure MongoDB is running locally or update MONGODB_URI in `.env` with your connection string.

Models created:
- User
- Movie
- Show  
- Theatre
- Booking
- Payment

### Common Issues

- **MongoDB connection fails**: Check MongoDB is running
- **Stripe errors**: Verify API keys are correct
- **CORS issues**: Check CLIENT_URL in backend .env
- **Port conflicts**: Change PORT in .env if needed

## Development

No comments in code as provided. Clean, production-ready codebase ready for deployment.
